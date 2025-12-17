import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTenantContext } from '@/lib/tenant'
import { storage } from '@/lib/storage'
import { validateFile, createRequestSchema } from '@/lib/validators'
import { canCreateRequest } from '@/lib/billing'
import { triggerN8nWorkflow, getCallbackUrl, getFileUrl } from '@/lib/n8n'
import { RequestStatus, PaymentStatus } from '@prisma/client'

// POST /api/t/[tenantSlug]/requests - Neue Request erstellen
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantSlug: string } }
) {
  try {
    const { tenantSlug } = params

    // Auth & Tenant prüfen
    const context = await getTenantContext(tenantSlug)
    if (!context) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    // Billing prüfen
    const billingCheck = await canCreateRequest(context.tenant.id)
    if (!billingCheck.allowed) {
      return NextResponse.json(
        { 
          error: billingCheck.reason,
          requiresPayment: billingCheck.requiresPayment,
        },
        { status: 402 }
      )
    }

    // FormData parsen
    const formData = await request.formData()
    
    const jobTitle = formData.get('jobTitle') as string
    const department = formData.get('department') as string | null
    const seniority = formData.get('seniority') as string | null
    const jobFile = formData.get('jobFile') as File | null
    const applicantFilesRaw = formData.getAll('applicantFiles') as File[]

    // Validierung
    const validation = createRequestSchema.safeParse({
      jobTitle,
      department: department || undefined,
      seniority: seniority || undefined,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    if (!jobFile) {
      return NextResponse.json(
        { error: 'Stellenausschreibung erforderlich' },
        { status: 400 }
      )
    }

    if (applicantFilesRaw.length === 0) {
      return NextResponse.json(
        { error: 'Mindestens eine Bewerbung erforderlich' },
        { status: 400 }
      )
    }

    // Dateien validieren
    const jobFileValidation = validateFile({
      name: jobFile.name,
      size: jobFile.size,
      type: jobFile.type,
    })
    if (!jobFileValidation.valid) {
      return NextResponse.json(
        { error: `Stellenausschreibung: ${jobFileValidation.error}` },
        { status: 400 }
      )
    }

    for (const file of applicantFilesRaw) {
      const fileValidation = validateFile({
        name: file.name,
        size: file.size,
        type: file.type,
      })
      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: `${file.name}: ${fileValidation.error}` },
          { status: 400 }
        )
      }
    }

    // Request erstellen
    const newRequest = await prisma.request.create({
      data: {
        tenantId: context.tenant.id,
        createdByUserId: context.user.id,
        jobTitle: validation.data.jobTitle,
        department: validation.data.department,
        seniority: validation.data.seniority,
        status: RequestStatus.DRAFT,
        paymentStatus: billingCheck.isDemo ? PaymentStatus.WAIVED : PaymentStatus.UNPAID,
      },
    })

    // Job File speichern
    const jobFileBuffer = Buffer.from(await jobFile.arrayBuffer())
    const jobFileResult = await storage.upload(jobFileBuffer, {
      tenantId: context.tenant.id,
      requestId: newRequest.id,
      filename: jobFile.name,
      type: 'job',
      mimeType: jobFile.type,
    })

    const savedJobFile = await prisma.jobFile.create({
      data: {
        requestId: newRequest.id,
        filename: jobFile.name,
        mimeType: jobFile.type,
        storagePath: jobFileResult.storagePath,
        fileSize: jobFileResult.fileSize,
      },
    })

    // Applicant Files speichern
    const savedApplicantFiles = []
    for (const file of applicantFilesRaw) {
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const fileResult = await storage.upload(fileBuffer, {
        tenantId: context.tenant.id,
        requestId: newRequest.id,
        filename: file.name,
        type: 'applicant',
        mimeType: file.type,
      })

      const savedFile = await prisma.applicantFile.create({
        data: {
          requestId: newRequest.id,
          filename: file.name,
          mimeType: file.type,
          storagePath: fileResult.storagePath,
          fileSize: fileResult.fileSize,
        },
      })
      savedApplicantFiles.push(savedFile)
    }

    // n8n Workflow starten (wenn Demo oder bereits bezahlt)
    if (billingCheck.isDemo || newRequest.paymentStatus === PaymentStatus.PAID) {
      // Status auf QUEUED setzen
      await prisma.request.update({
        where: { id: newRequest.id },
        data: { status: RequestStatus.QUEUED },
      })

      // n8n triggern
      const n8nResponse = await triggerN8nWorkflow({
        requestId: newRequest.id,
        tenantId: context.tenant.id,
        tenantSlug: context.tenant.slug,
        jobFileUrl: getFileUrl(context.tenant.slug, savedJobFile.id),
        applicantFileUrls: savedApplicantFiles.map((f) =>
          getFileUrl(context.tenant.slug, f.id)
        ),
        metadata: {
          jobTitle: newRequest.jobTitle,
          department: newRequest.department || undefined,
          seniority: newRequest.seniority || undefined,
        },
        callbackUrl: getCallbackUrl(),
      })

      if (n8nResponse.success) {
        await prisma.request.update({
          where: { id: newRequest.id },
          data: {
            status: RequestStatus.RUNNING,
            n8nExecutionId: n8nResponse.executionId,
          },
        })

        // Webhook Event loggen
        await prisma.webhookEventLog.create({
          data: {
            tenantId: context.tenant.id,
            requestId: newRequest.id,
            eventType: 'N8N_WORKFLOW_STARTED',
            payloadJson: {
              executionId: n8nResponse.executionId,
            },
          },
        })
      }
    } else {
      // Status auf PENDING_PAYMENT setzen
      await prisma.request.update({
        where: { id: newRequest.id },
        data: { status: RequestStatus.PENDING_PAYMENT },
      })
    }

    return NextResponse.json({
      success: true,
      requestId: newRequest.id,
    })
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET /api/t/[tenantSlug]/requests - Alle Requests laden
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantSlug: string } }
) {
  try {
    const { tenantSlug } = params

    // Auth & Tenant prüfen
    const context = await getTenantContext(tenantSlug)
    if (!context) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const requests = await prisma.request.findMany({
      where: { tenantId: context.tenant.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applicantFiles: true, resultCandidates: true },
        },
      },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Get requests error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
