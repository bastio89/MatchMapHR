import crypto from 'crypto'

// n8n Webhook Client für das Triggern von Workflows

interface N8nStartPayload {
  requestId: string
  tenantId: string
  tenantSlug: string
  jobFileUrl: string
  applicantFileUrls: string[]
  metadata: {
    jobTitle: string
    department?: string
    seniority?: string
  }
  callbackUrl: string
}

interface N8nWebhookResponse {
  success: boolean
  executionId?: string
  error?: string
}

/**
 * n8n Workflow starten
 * Sendet die Request-Daten an den n8n Webhook
 */
export async function triggerN8nWorkflow(payload: N8nStartPayload): Promise<N8nWebhookResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_START_URL

  if (!webhookUrl) {
    console.error('N8N_WEBHOOK_START_URL nicht konfiguriert')
    return {
      success: false,
      error: 'n8n Webhook URL nicht konfiguriert',
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n Webhook Fehler:', response.status, errorText)
      return {
        success: false,
        error: `n8n Webhook Fehler: ${response.status}`,
      }
    }

    const data = await response.json()
    
    return {
      success: true,
      executionId: data.executionId || data.id || 'unknown',
    }
  } catch (error) {
    console.error('n8n Webhook Aufruf fehlgeschlagen:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    }
  }
}

/**
 * HMAC-Signatur für n8n Callback validieren
 */
export function validateN8nSignature(payload: string, signature: string): boolean {
  const secret = process.env.N8N_CALLBACK_HMAC_SECRET

  if (!secret) {
    console.error('N8N_CALLBACK_HMAC_SECRET nicht konfiguriert')
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Timing-safe Vergleich
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * Callback URL für n8n generieren
 */
export function getCallbackUrl(): string {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/api/n8n/callback`
}

/**
 * File URL für n8n generieren (für Download durch n8n)
 */
export function getFileUrl(tenantSlug: string, fileId: string): string {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/api/t/${tenantSlug}/files/${fileId}`
}

// ============================================
// BEISPIEL PAYLOADS (für README/Dokumentation)
// ============================================

/*
Beispiel: Payload der an n8n gesendet wird (POST /api/t/[tenantSlug]/requests/[requestId]/start)

{
  "requestId": "clx123abc",
  "tenantId": "clx456def",
  "tenantSlug": "demo-firma",
  "jobFileUrl": "http://localhost:3000/api/t/demo-firma/files/job_clx789ghi",
  "applicantFileUrls": [
    "http://localhost:3000/api/t/demo-firma/files/app_clx111aaa",
    "http://localhost:3000/api/t/demo-firma/files/app_clx222bbb"
  ],
  "metadata": {
    "jobTitle": "Senior Frontend Entwickler",
    "department": "Engineering",
    "seniority": "Senior"
  },
  "callbackUrl": "http://localhost:3000/api/n8n/callback"
}

---

Beispiel: Callback von n8n (POST /api/n8n/callback)
Header: X-Signature: <HMAC-SHA256>

{
  "requestId": "clx123abc",
  "status": "DONE",
  "results": [
    {
      "candidateName": "Anna Müller",
      "email": "anna@email.de",
      "score": 92,
      "skills": ["React", "TypeScript", "Next.js"],
      "highlights": [
        {
          "skill": "React",
          "evidence": "5 Jahre Erfahrung mit React"
        }
      ],
      "missingSkills": ["AWS"],
      "summary": "Hervorragende Kandidatin..."
    }
  ]
}

---

Beispiel: Callback bei Fehler

{
  "requestId": "clx123abc",
  "status": "FAILED",
  "error": "Konnte PDF nicht verarbeiten"
}
*/
