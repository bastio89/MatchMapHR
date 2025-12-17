import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireTenantContext } from '@/lib/tenant'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-timeline'
import { NoRequestsEmpty } from '@/components/empty-state'
import { formatDate } from '@/lib/utils'
import t from '@/lib/i18n'

interface RequestsPageProps {
  params: { tenantSlug: string }
}

export default async function RequestsPage({ params }: RequestsPageProps) {
  const { tenantSlug } = params
  const context = await requireTenantContext(tenantSlug)

  // Alle Requests laden
  const requests = await prisma.request.findMany({
    where: { tenantId: context.tenant.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { 
          applicantFiles: true,
          resultCandidates: true,
        },
      },
      createdBy: {
        select: { name: true, email: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.requests.title}</h1>
          <p className="text-muted-foreground">
            Alle Ihre Analyse-Anfragen auf einen Blick
          </p>
        </div>
        <Button asChild>
          <Link href={`/t/${tenantSlug}/app/new-request`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.requests.newRequest}
          </Link>
        </Button>
      </div>

      {/* Requests Table */}
      {requests.length === 0 ? (
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Erstellt von
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  {t.requests.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b last:border-0 hover:bg-muted/50">
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
                        {request.seniority && ` • ${request.seniority}`}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {request._count.applicantFiles} Bewerbung
                      {request._count.applicantFiles !== 1 ? 'en' : ''}
                    </div>
                    {request.status === 'DONE' && (
                      <p className="text-xs text-muted-foreground">
                        {request._count.resultCandidates} Ergebnis
                        {request._count.resultCandidates !== 1 ? 'se' : ''}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {request.createdBy.name || request.createdBy.email}
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
  )
}
