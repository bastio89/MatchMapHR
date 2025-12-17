import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// File Storage Abstraktion
// Supabase Storage als primärer Provider

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
// SUPABASE STORAGE PROVIDER
// ============================================

class SupabaseStorageProvider implements StorageProvider {
  private supabase
  private bucketName: string

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'matchmap-files'
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  async upload(file: Buffer, options: UploadOptions): Promise<StorageResult> {
    // Pfad erstellen: [tenantId]/[requestId]/[type]/[filename]
    const safeFilename = this.sanitizeFilename(options.filename)
    const storagePath = `${options.tenantId}/${options.requestId}/${options.type}/${safeFilename}`

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(storagePath, file, {
        contentType: options.mimeType,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`File upload failed: ${error.message}`)
    }

    return {
      storagePath,
      fileSize: file.length,
    }
  }

  async download(storagePath: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(storagePath)

    if (error) {
      throw new Error(`File download failed: ${error.message}`)
    }

    return Buffer.from(await data.arrayBuffer())
  }

  async delete(storagePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([storagePath])

    if (error) {
      console.error('Delete error:', error)
    }
  }

  async exists(storagePath: string): Promise<boolean> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(path.dirname(storagePath), {
        search: path.basename(storagePath),
      })

    if (error) return false
    return data.length > 0
  }

  async getSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(storagePath, expiresIn)

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
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
// LOKALER STORAGE PROVIDER (Fallback)
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
    const token = crypto.randomBytes(32).toString('hex')
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
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
    // Supabase Storage als primärer Provider, Local als Fallback
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (useSupabase) {
      storageInstance = new SupabaseStorageProvider()
    } else {
      console.warn('Supabase Storage not configured, using local storage')
      storageInstance = new LocalStorageProvider()
    }
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
