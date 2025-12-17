import { z } from 'zod'

// ============================================
// AUTH VALIDATOREN
// ============================================

export const signupSchema = z.object({
  email: z.string().email('Bitte gültige E-Mail-Adresse eingeben'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben'),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  companyName: z.string().min(2, 'Firmenname muss mindestens 2 Zeichen haben'),
})

export const signinSchema = z.object({
  email: z.string().email('Bitte gültige E-Mail-Adresse eingeben'),
  password: z.string().min(1, 'Passwort erforderlich'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type SigninInput = z.infer<typeof signinSchema>

// ============================================
// REQUEST VALIDATOREN
// ============================================

export const createRequestSchema = z.object({
  jobTitle: z.string().min(2, 'Jobtitel muss mindestens 2 Zeichen haben').max(200),
  department: z.string().max(100).optional(),
  seniority: z.string().max(50).optional(),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>

// ============================================
// FILE VALIDATOREN
// ============================================

// Erlaubte MIME Types
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
] as const

// Erlaubte Dateiendungen
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'] as const

// Max Dateigröße in Bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Max Anzahl Bewerbungen pro Request
export const MAX_APPLICANT_FILES = 50

export function validateFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as typeof ALLOWED_MIME_TYPES[number])
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

export function getFileExtension(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  return ext
}

export function validateFileName(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ALLOWED_EXTENSIONS.includes(ext as typeof ALLOWED_EXTENSIONS[number])
}

// Vollständige Datei-Validierung
export function validateFile(file: { name: string; size: number; type: string }): {
  valid: boolean
  error?: string
} {
  if (!validateFileName(file.name)) {
    return {
      valid: false,
      error: `Dateityp nicht erlaubt. Erlaubt: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  if (!validateFileSize(file.size)) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `Datei zu groß. Maximum: ${maxMB}MB`,
    }
  }

  return { valid: true }
}

// ============================================
// N8N CALLBACK VALIDATOR
// ============================================

export const n8nCallbackSchema = z.object({
  requestId: z.string(),
  status: z.enum(['DONE', 'FAILED']),
  error: z.string().optional(),
  results: z.array(z.object({
    candidateName: z.string(),
    email: z.string().optional(),
    score: z.number().min(0).max(100),
    skills: z.array(z.string()).optional(),
    highlights: z.array(z.object({
      skill: z.string(),
      evidence: z.string(),
    })).optional(),
    missingSkills: z.array(z.string()).optional(),
    summary: z.string().optional(),
  })).optional(),
})

export type N8nCallbackInput = z.infer<typeof n8nCallbackSchema>

// ============================================
// TENANT SETTINGS VALIDATOR
// ============================================

export const tenantSettingsSchema = z.object({
  name: z.string().min(2, 'Firmenname muss mindestens 2 Zeichen haben').max(100),
})

export type TenantSettingsInput = z.infer<typeof tenantSettingsSchema>
