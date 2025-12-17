import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTenantContext } from '@/lib/tenant'
import { storage } from '@/lib/storage'

// GET /api/t/[tenantSlug]/files/[fileId] - Datei herunterladen
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantSlug: string; fileId: string } }
) {
  try {
    const { tenantSlug, fileId } = params
    const searchParams = request.nextUrl.searchParams
    const fileType = searchParams.get('type') // 'job' oder 'applicant'

    // Auth & Tenant prüfen
    const context = await getTenantContext(tenantSlug)
    if (!context) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    let file: { filename: string; mimeType: string; storagePath: string } | null = null
    let requestTenantId: string | null = null

    // Datei je nach Typ laden
    if (fileType === 'job') {
      const jobFile = await prisma.jobFile.findUnique({
        where: { id: fileId },
        include: {
          request: {
            select: { tenantId: true },
          },
        },
      })
      if (jobFile) {
        file = {
          filename: jobFile.filename,
          mimeType: jobFile.mimeType,
          storagePath: jobFile.storagePath,
        }
        requestTenantId = jobFile.request.tenantId
      }
    } else {
      const applicantFile = await prisma.applicantFile.findUnique({
        where: { id: fileId },
        include: {
          request: {
            select: { tenantId: true },
          },
        },
      })
      if (applicantFile) {
        file = {
          filename: applicantFile.filename,
          mimeType: applicantFile.mimeType,
          storagePath: applicantFile.storagePath,
        }
        requestTenantId = applicantFile.request.tenantId
      }
    }

    if (!file) {
      return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 })
    }

    // Tenant-Scope prüfen
    if (requestTenantId !== context.tenant.id) {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 })
    }

    // Datei aus Storage laden
    const exists = await storage.exists(file.storagePath)
    if (!exists) {
      return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 })
    }

    const fileBuffer = await storage.download(file.storagePath)

    // Response mit korrektem Content-Type
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('File download error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
