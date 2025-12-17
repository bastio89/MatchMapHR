import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateN8nSignature } from '@/lib/n8n'
import { n8nCallbackSchema } from '@/lib/validators'
import { RequestStatus } from '@prisma/client'

// POST /api/n8n/callback - Callback von n8n nach Analyse
export async function POST(request: NextRequest) {
  try {
    // Signatur validieren
    const signature = request.headers.get('x-signature') || ''
    const body = await request.text()

    // HMAC-Signatur prüfen (wenn konfiguriert)
    if (process.env.N8N_CALLBACK_HMAC_SECRET) {
      const isValid = validateN8nSignature(body, signature)
      if (!isValid) {
        console.error('Invalid n8n callback signature')
        return NextResponse.json(
          { error: 'Ungültige Signatur' },
          { status: 401 }
        )
      }
    }

    // Body parsen
    let payload
    try {
      payload = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges JSON' },
        { status: 400 }
      )
    }

    // Validierung
    const validation = n8nCallbackSchema.safeParse(payload)
    if (!validation.success) {
      console.error('Invalid n8n callback payload:', validation.error)
      return NextResponse.json(
        { error: 'Ungültiges Payload-Format' },
        { status: 400 }
      )
    }

    const { requestId, status, results, error } = validation.data

    // Request laden
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { tenant: true },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request nicht gefunden' },
        { status: 404 }
      )
    }

    // Status aktualisieren
    const newStatus = status === 'DONE' ? RequestStatus.DONE : RequestStatus.FAILED

    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        completedAt: new Date(),
      },
    })

    // Bei Erfolg: Ergebnisse speichern
    if (status === 'DONE' && results && results.length > 0) {
      // Alte Ergebnisse löschen (falls Retry)
      await prisma.resultCandidate.deleteMany({
        where: { requestId },
      })

      // Neue Ergebnisse speichern
      for (const result of results) {
        await prisma.resultCandidate.create({
          data: {
            requestId,
            candidateName: result.candidateName,
            email: result.email,
            score: result.score,
            skillsJson: result.skills ? { skills: result.skills } : undefined,
            highlightsJson: result.highlights
              ? { highlights: result.highlights }
              : undefined,
            missingSkillsJson: result.missingSkills
              ? { missing: result.missingSkills }
              : undefined,
            summary: result.summary,
          },
        })
      }
    }

    // Webhook Event loggen
    await prisma.webhookEventLog.create({
      data: {
        tenantId: existingRequest.tenantId,
        requestId,
        eventType: 'N8N_CALLBACK',
        payloadJson: {
          status,
          resultsCount: results?.length || 0,
          error: error || null,
        },
      },
    })

    console.log(
      `n8n callback processed: Request ${requestId} -> ${newStatus} (${results?.length || 0} results)`
    )

    return NextResponse.json({
      success: true,
      requestId,
      status: newStatus,
      resultsCount: results?.length || 0,
    })
  } catch (err) {
    console.error('n8n callback error:', err)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
