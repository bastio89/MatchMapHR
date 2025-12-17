'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { validateFile, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import t from '@/lib/i18n'

export interface FileWithPreview extends File {
  preview?: string
  error?: string
}

interface FileDropzoneProps {
  onFilesChange: (files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  accept?: Accept
  className?: string
  title?: string
  description?: string
}

export function FileDropzone({
  onFilesChange,
  multiple = false,
  maxFiles = 50,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
  className,
  title,
  description,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrors([])
      const newErrors: string[] = []
      const validFiles: FileWithPreview[] = []

      for (const file of acceptedFiles) {
        const validation = validateFile(file)
        if (validation.valid) {
          validFiles.push(Object.assign(file, { preview: undefined }))
        } else {
          newErrors.push(`${file.name}: ${validation.error}`)
        }
      }

      // Limit prüfen
      const totalFiles = multiple ? [...files, ...validFiles] : validFiles
      const limitedFiles = totalFiles.slice(0, maxFiles)

      if (totalFiles.length > maxFiles) {
        newErrors.push(`Maximal ${maxFiles} Dateien erlaubt`)
      }

      setFiles(limitedFiles)
      setErrors(newErrors)
      onFilesChange(limitedFiles)
    },
    [files, multiple, maxFiles, onFilesChange]
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    accept,
  })

  const maxMB = MAX_FILE_SIZE / (1024 * 1024)

  return (
    <div className={cn('space-y-3', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          files.length > 0 && !multiple && 'border-green-500 bg-green-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload
            className={cn(
              'h-10 w-10',
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {title || t.upload.dropzone.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {description || t.upload.dropzone.subtitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {ALLOWED_EXTENSIONS.join(', ').toUpperCase()} bis {maxMB}MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border bg-muted/50 p-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t.upload.remove}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* File Count */}
      {multiple && files.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {files.length} {files.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
        </p>
      )}
    </div>
  )
}
