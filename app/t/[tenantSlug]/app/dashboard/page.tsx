import Link from 'next/link'
import { PlusCircle, FolderOpen, CreditCard, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireTenantContext } from '@/lib/tenant'
import { getRemainingRequests, PLAN_CONFIG } from '@/lib/billing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-timeline'
import { NoRequestsEmpty } from '@/components/empty-state'
import { formatRelativeTime } from '@/lib/utils'
import t from '@/lib/i18n'

interface DashboardPageProps {
  params: { tenantSlug: string }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tenantSlug } = params
  const context = await requireTenantContext(tenantSlug)

  // Letzte Requests laden
  const recentRequests = await prisma.request.findMany({
    where: { tenantId: context.tenant.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      _count: {
        select: { applicantFiles: true },
      },
    },
  })

  // Verbleibende Requests
  const remainingRequests = await getRemainingRequests(context.tenant.id)
  const planConfig = PLAN_CONFIG[context.tenant.plan]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
        <p className="text-muted-foreground">
          {t.dashboard.welcome}, {context.user.name || context.user.email}!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Neue Anfrage */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PlusCircle className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{t.dashboard.newRequest}</CardTitle>
            <CardDescription>
              Stellenausschreibung und Bewerbungen hochladen
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/t/${tenantSlug}/app/new-request`}>
                Jetzt starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Anfragen */}
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{t.requests.title}</CardTitle>
            <CardDescription>
              {recentRequests.length} Anfrage{recentRequests.length !== 1 ? 'n' : ''} insgesamt
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/t/${tenantSlug}/app/requests`}>Alle anzeigen</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Plan/Credits */}
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{t.dashboard.credits.title}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mt-1">
                {planConfig.name}
              </Badge>
            </CardDescription>
            <div className="mt-2">
              {remainingRequests.unlimited ? (
                <span className="text-sm text-muted-foreground">
                  {t.dashboard.credits.unlimited}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {remainingRequests.limit - remainingRequests.used} von{' '}
                  {remainingRequests.limit} {t.dashboard.credits.remaining}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/t/${tenantSlug}/app/settings`}>
                {t.dashboard.credits.upgrade}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Letzte Anfragen */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t.dashboard.recentRequests}</h2>
          <Button variant="ghost" asChild>
            <Link href={`/t/${tenantSlug}/app/requests`}>
              Alle anzeigen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentRequests.length === 0 ? (
          <NoRequestsEmpty className="py-12" />
        ) : (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t.requests.table.jobTitle}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t.requests.table.applicants}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t.requests.table.status}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t.requests.table.createdAt}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    {t.requests.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/t/${tenantSlug}/app/requests/${request.id}`}
                        className="font-medium hover:underline"
                      >
                        {request.jobTitle}
                      </Link>
                      {request.department && (
                        <p className="text-xs text-muted-foreground">
                          {request.department}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {request._count.applicantFiles}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatRelativeTime(request.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/t/${tenantSlug}/app/requests/${request.id}`}>
                          {t.common.details}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
