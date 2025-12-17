import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// File Storage Abstraktion
// Aktuell: Lokales Dateisystem
// Später: S3-kompatibel (Interface ist vorbereitet)

export interface StorageProvider {
  upload(file: Buffer, options: UploadOptions): Promise<StorageResult>
  download(storagePath: string): Promise<Buffer>
  delete(storagePath: string): Promise<void>
  exists(storagePath: string): Promise<boolean>
  getSignedUrl(storagePath: string, expiresIn?: number): Promise<string>
}

export interface UploadOptions {
  tenantId: string
  requestId: string
  filename: string
  type: 'job' | 'applicant'
  mimeType: string
}

export interface StorageResult {
  storagePath: string
  fileSize: number
}

// ============================================
// LOKALER STORAGE PROVIDER
// ============================================

class LocalStorageProvider implements StorageProvider {
  private baseDir: string

  constructor() {
    this.baseDir = process.env.UPLOAD_DIR || './uploads'
  }

  private getFilePath(storagePath: string): string {
    return path.join(this.baseDir, storagePath)
  }

  async upload(file: Buffer, options: UploadOptions): Promise<StorageResult> {
    // Pfad erstellen: /uploads/[tenantId]/[requestId]/[type]/[filename]
    const safeFilename = this.sanitizeFilename(options.filename)
    const storagePath = path.join(
      options.tenantId,
      options.requestId,
      options.type,
      safeFilename
    )

    const fullPath = this.getFilePath(storagePath)
    
    // Verzeichnis erstellen falls nicht vorhanden
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    
    // Datei schreiben
    await fs.writeFile(fullPath, file)

    return {
      storagePath,
      fileSize: file.length,
    }
  }

  async download(storagePath: string): Promise<Buffer> {
    const fullPath = this.getFilePath(storagePath)
    return fs.readFile(fullPath)
  }

  async delete(storagePath: string): Promise<void> {
    const fullPath = this.getFilePath(storagePath)
    try {
      await fs.unlink(fullPath)
    } catch (error) {
      // Ignorieren wenn Datei nicht existiert
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  async exists(storagePath: string): Promise<boolean> {
    const fullPath = this.getFilePath(storagePath)
    try {
      await fs.access(fullPath)
      return true
    } catch {
      return false
    }
  }

  async getSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
    // Für lokalen Storage: Einfache Token-basierte URL
    // In Production mit S3: Pre-signed URL
    const token = crypto.randomBytes(32).toString('hex')
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
    // Hinweis: Token-Validierung müsste noch implementiert werden
    return `${baseUrl}/api/files/download?path=${encodeURIComponent(storagePath)}&token=${token}`
  }

  private sanitizeFilename(filename: string): string {
    // Nur sichere Zeichen erlauben
    const sanitized = filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
    
    // Unique Suffix hinzufügen um Kollisionen zu vermeiden
    const ext = path.extname(sanitized)
    const base = path.basename(sanitized, ext)
    const uniqueId = crypto.randomBytes(4).toString('hex')
    
    return `${base}_${uniqueId}${ext}`
  }
}

// ============================================
// S3 STORAGE PROVIDER (Placeholder)
// ============================================

/*
class S3StorageProvider implements StorageProvider {
  private client: S3Client
  private bucket: string

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    this.bucket = process.env.S3_BUCKET!
  }

  async upload(file: Buffer, options: UploadOptions): Promise<StorageResult> {
    // S3 PutObject Implementation
  }

  async download(storagePath: string): Promise<Buffer> {
    // S3 GetObject Implementation
  }

  async delete(storagePath: string): Promise<void> {
    // S3 DeleteObject Implementation
  }

  async exists(storagePath: string): Promise<boolean> {
    // S3 HeadObject Implementation
  }

  async getSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
    // S3 getSignedUrl Implementation
  }
}
*/

// ============================================
// STORAGE SINGLETON
// ============================================

let storageInstance: StorageProvider | null = null

export function getStorage(): StorageProvider {
  if (!storageInstance) {
    // Hier könnte basierend auf ENV zwischen Local und S3 gewechselt werden
    // if (process.env.STORAGE_PROVIDER === 's3') {
    //   storageInstance = new S3StorageProvider()
    // } else {
    storageInstance = new LocalStorageProvider()
    // }
  }
  return storageInstance
}

// Convenience Exports
export const storage = {
  upload: (file: Buffer, options: UploadOptions) => getStorage().upload(file, options),
  download: (storagePath: string) => getStorage().download(storagePath),
  delete: (storagePath: string) => getStorage().delete(storagePath),
  exists: (storagePath: string) => getStorage().exists(storagePath),
  getSignedUrl: (storagePath: string, expiresIn?: number) => getStorage().getSignedUrl(storagePath, expiresIn),
}
