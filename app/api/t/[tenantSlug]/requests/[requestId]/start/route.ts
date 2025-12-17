import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTenantContext } from '@/lib/tenant'
import { triggerN8nWorkflow, getCallbackUrl, getFileUrl } from '@/lib/n8n'
import { RequestStatus } from '@prisma/client'

// POST /api/t/[tenantSlug]/requests/[requestId]/start - n8n Workflow starten
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantSlug: string; requestId: string } }
) {
  try {
    const { tenantSlug, requestId } = params

    // Auth & Tenant prüfen
    const context = await getTenantContext(tenantSlug)
    if (!context) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    // Request laden (mit Tenant-Scope!)
    const existingRequest = await prisma.request.findUnique({
      where: {
        id: requestId,
        tenantId: context.tenant.id,
      },
      include: {
        jobFile: true,
        applicantFiles: true,
      },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: 'Anfrage nicht gefunden' }, { status: 404 })
    }

    // Prüfen ob Request gestartet werden kann
    if (existingRequest.status !== 'DRAFT' && existingRequest.status !== 'PENDING_PAYMENT') {
      return NextResponse.json(
        { error: 'Anfrage kann nicht gestartet werden (ungültiger Status)' },
        { status: 400 }
      )
    }

    // Prüfen ob Dateien vorhanden
    if (!existingRequest.jobFile || existingRequest.applicantFiles.length === 0) {
      return NextResponse.json(
        { error: 'Dateien fehlen' },
        { status: 400 }
      )
    }

    // Status auf QUEUED setzen
    await prisma.request.update({
      where: { id: requestId },
      data: { status: RequestStatus.QUEUED },
    })

    // n8n Workflow triggern
    const n8nResponse = await triggerN8nWorkflow({
      requestId: existingRequest.id,
      tenantId: context.tenant.id,
      tenantSlug: context.tenant.slug,
      jobFileUrl: getFileUrl(context.tenant.slug, existingRequest.jobFile.id),
      applicantFileUrls: existingRequest.applicantFiles.map((f) =>
        getFileUrl(context.tenant.slug, f.id)
      ),
      metadata: {
        jobTitle: existingRequest.jobTitle,
        department: existingRequest.department || undefined,
        seniority: existingRequest.seniority || undefined,
      },
      callbackUrl: getCallbackUrl(),
    })

    if (n8nResponse.success) {
      // Status auf RUNNING setzen
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: RequestStatus.RUNNING,
          n8nExecutionId: n8nResponse.executionId,
        },
      })

      // Event loggen
      await prisma.webhookEventLog.create({
        data: {
          tenantId: context.tenant.id,
          requestId: requestId,
          eventType: 'N8N_WORKFLOW_STARTED',
          payloadJson: {
            executionId: n8nResponse.executionId,
          },
        },
      })

      return NextResponse.json({
        success: true,
        executionId: n8nResponse.executionId,
      })
    } else {
      // Fehler beim Starten
      await prisma.request.update({
        where: { id: requestId },
        data: { status: RequestStatus.FAILED },
      })

      return NextResponse.json(
        { error: n8nResponse.error || 'n8n Workflow konnte nicht gestartet werden' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Start request error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
