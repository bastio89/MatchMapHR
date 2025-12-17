'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDropzone } from '@/components/file-dropzone'
import t from '@/lib/i18n'

interface NewRequestPageProps {
  params: { tenantSlug: string }
}

export default function NewRequestPage({ params }: NewRequestPageProps) {
  const { tenantSlug } = params
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form State
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [seniority, setSeniority] = useState('')
  const [jobFile, setJobFile] = useState<File | null>(null)
  const [applicantFiles, setApplicantFiles] = useState<File[]>([])

  const handleJobFileChange = (files: File[]) => {
    setJobFile(files[0] || null)
  }

  const handleApplicantFilesChange = (files: File[]) => {
    setApplicantFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validierung
    if (!jobTitle.trim()) {
      setError('Bitte geben Sie einen Jobtitel ein')
      return
    }
    if (!jobFile) {
      setError('Bitte laden Sie eine Stellenausschreibung hoch')
      return
    }
    if (applicantFiles.length === 0) {
      setError('Bitte laden Sie mindestens eine Bewerbung hoch')
      return
    }

    setLoading(true)

    try {
      // FormData erstellen
      const formData = new FormData()
      formData.append('jobTitle', jobTitle)
      if (department) formData.append('department', department)
      if (seniority) formData.append('seniority', seniority)
      formData.append('jobFile', jobFile)
      applicantFiles.forEach((file) => {
        formData.append('applicantFiles', file)
      })

      // Request erstellen
      const response = await fetch(`/api/t/${tenantSlug}/requests`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen der Anfrage')
      }

      // Weiterleiten zur Request-Detail-Seite
      router.push(`/t/${tenantSlug}/app/requests/${data.requestId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/t/${tenantSlug}/app/dashboard`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t.requests.form.title}</h1>
          <p className="text-muted-foreground">
            Laden Sie die Stellenausschreibung und Bewerbungen hoch
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Job Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Stellendetails</CardTitle>
            <CardDescription>
              Grundlegende Informationen zur Position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                {t.requests.form.jobTitle} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder={t.requests.form.jobTitlePlaceholder}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">
                  {t.requests.form.department}{' '}
                  <span className="text-xs text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input
                  id="department"
                  placeholder={t.requests.form.departmentPlaceholder}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority">
                  {t.requests.form.seniority}{' '}
                  <span className="text-xs text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input
                  id="seniority"
                  placeholder={t.requests.form.seniorityPlaceholder}
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job File Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t.requests.form.jobFile} <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>
              {t.requests.form.jobFileDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileDropzone
              onFilesChange={handleJobFileChange}
              multiple={false}
              title="Stellenausschreibung hier ablegen"
            />
          </CardContent>
        </Card>

        {/* Applicant Files Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t.requests.form.applicantFiles} <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>
              {t.requests.form.applicantFilesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileDropzone
              onFilesChange={handleApplicantFilesChange}
              multiple={true}
              maxFiles={50}
              title="Bewerbungen hier ablegen"
              description="Mehrere Dateien auswählen oder nacheinander ablegen"
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Bereit zur Analyse?</p>
                <p className="text-sm text-muted-foreground">
                  {jobFile ? '1 Stellenausschreibung' : 'Keine Stellenausschreibung'} und{' '}
                  {applicantFiles.length} Bewerbung{applicantFiles.length !== 1 ? 'en' : ''}{' '}
                  ausgewählt
                </p>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !jobFile || applicantFiles.length === 0}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.requests.form.startAnalysis}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
