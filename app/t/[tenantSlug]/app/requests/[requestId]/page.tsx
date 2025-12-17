import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireTenantContext } from '@/lib/tenant'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { StatusTimeline, StatusBadge } from '@/components/status-timeline'
import { NoResultsEmpty } from '@/components/empty-state'
import { cn, formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils'
import t from '@/lib/i18n'

interface RequestDetailPageProps {
  params: { tenantSlug: string; requestId: string }
}

// Types für JSON Felder
interface SkillHighlight {
  skill: string
  evidence: string
}

interface ResultSkills {
  skills?: string[]
}

interface ResultHighlights {
  highlights?: SkillHighlight[]
}

interface ResultMissingSkills {
  missing?: string[]
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { tenantSlug, requestId } = params
  const context = await requireTenantContext(tenantSlug)

  // Request mit allen Relationen laden
  const request = await prisma.request.findUnique({
    where: { 
      id: requestId,
      tenantId: context.tenant.id, // Tenant-Scope!
    },
    include: {
      jobFile: true,
      applicantFiles: true,
      resultCandidates: {
        orderBy: { score: 'desc' },
      },
      createdBy: {
        select: { name: true, email: true },
      },
    },
  })

  if (!request) {
    notFound()
  }

  // JSON-Felder parsen
  const parseSkills = (json: unknown): string[] => {
    const data = json as ResultSkills | null
    return data?.skills || []
  }

  const parseHighlights = (json: unknown): SkillHighlight[] => {
    const data = json as ResultHighlights | null
    return data?.highlights || []
  }

  const parseMissingSkills = (json: unknown): string[] => {
    const data = json as ResultMissingSkills | null
    return data?.missing || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href={`/t/${tenantSlug}/app/requests`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{request.jobTitle}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {request.department && <span>{request.department}</span>}
              {request.seniority && (
                <>
                  <span>•</span>
                  <span>{request.seniority}</span>
                </>
              )}
              <span>•</span>
              <span>{formatDate(request.createdAt)}</span>
              <span>•</span>
              <span>von {request.createdBy.name || request.createdBy.email}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Status & Files */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline
                currentStatus={request.status}
                createdAt={request.createdAt}
                updatedAt={request.updatedAt}
                completedAt={request.completedAt}
              />
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dateien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job File */}
              {request.jobFile && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                    Stellenausschreibung
                  </p>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">
                        {request.jobFile.filename}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/api/t/${tenantSlug}/files/${request.jobFile.id}?type=job`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Applicant Files */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  Bewerbungen ({request.applicantFiles.length})
                </p>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {request.applicantFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-xs">{file.filename}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/api/t/${tenantSlug}/files/${file.id}?type=applicant`}>
                          <Download className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Buttons (Placeholder) */}
          {request.status === 'DONE' && request.resultCandidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.common.export}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  {t.requests.detail.export.csv}
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  {t.requests.detail.export.pdf}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Export-Funktion in Kürze verfügbar
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.requests.detail.results}</CardTitle>
              <CardDescription>
                {request.resultCandidates.length > 0
                  ? `${request.resultCandidates.length} Kandidaten analysiert, sortiert nach Score`
                  : 'Keine Ergebnisse verfügbar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.resultCandidates.length === 0 ? (
                <NoResultsEmpty />
              ) : (
                <div className="space-y-4">
                  {request.resultCandidates.map((candidate, index) => {
                    const skills = parseSkills(candidate.skillsJson)
                    const highlights = parseHighlights(candidate.highlightsJson)
                    const missingSkills = parseMissingSkills(candidate.missingSkillsJson)

                    return (
                      <div
                        key={candidate.id}
                        className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        {/* Header */}
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {index + 1}
                              </span>
                              <h3 className="font-semibold">{candidate.candidateName}</h3>
                            </div>
                            {candidate.email && (
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {candidate.email}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className={cn(
                                'inline-flex items-center rounded-full px-3 py-1 text-lg font-bold',
                                getScoreBgColor(candidate.score),
                                getScoreColor(candidate.score)
                              )}
                            >
                              {candidate.score}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>

                        {/* Score Bar */}
                        <div className="mb-4">
                          <Progress value={candidate.score} className="h-2" />
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <div className="mb-3">
                            <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                              {t.requests.detail.skills}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Highlights */}
                        {highlights.length > 0 && (
                          <div className="mb-3">
                            <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                              {t.requests.detail.highlights}
                            </p>
                            <ul className="space-y-1">
                              {highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Badge variant="success" className="mt-0.5 shrink-0 text-xs">
                                    {h.skill}
                                  </Badge>
                                  <span className="text-muted-foreground">{h.evidence}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Missing Skills */}
                        {missingSkills.length > 0 && (
                          <div className="mb-3">
                            <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                              {t.requests.detail.missingSkills}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {missingSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        {candidate.summary && (
                          <div>
                            <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                              {t.requests.detail.summary}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
