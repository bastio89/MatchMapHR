import { prisma } from '@/lib/db'
import { requireTenantContext, isAdmin } from '@/lib/tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/empty-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, formatDate } from '@/lib/utils'
import { Key, Users, Building2, RefreshCw, Copy, Plus } from 'lucide-react'
import t from '@/lib/i18n'

interface SettingsPageProps {
  params: { tenantSlug: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { tenantSlug } = params
  const context = await requireTenantContext(tenantSlug)
  const canEdit = isAdmin(context)

  // Team Members laden
  const teamMembers = await prisma.tenantUser.findMany({
    where: { tenantId: context.tenant.id },
    include: {
      user: {
        select: { id: true, email: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  // API Keys laden
  const apiKeys = await prisma.apiKey.findMany({
    where: { tenantId: context.tenant.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t.settings.title}</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Organisation und Team-Einstellungen
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            {t.settings.tabs.general}
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            {t.settings.tabs.team}
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            {t.settings.tabs.api}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.general.title}</CardTitle>
              <CardDescription>
                Grundlegende Informationen zu Ihrer Organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t.settings.general.companyName}</Label>
                <Input
                  id="companyName"
                  defaultValue={context.tenant.name}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label>Tenant-Slug</Label>
                <Input value={context.tenant.slug} disabled />
                <p className="text-xs text-muted-foreground">
                  Der URL-Slug kann nicht geändert werden
                </p>
              </div>

              <div className="space-y-2">
                <Label>Plan</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{context.tenant.plan}</Badge>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Upgrade-Optionen
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t.settings.general.logo}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-muted">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" disabled>
                    {t.settings.general.logoUpload}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Logo-Upload in Kürze verfügbar
                </p>
              </div>
            </CardContent>
            {canEdit && (
              <CardFooter>
                <Button disabled>{t.settings.general.save}</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t.settings.team.title}</CardTitle>
                  <CardDescription>
                    {teamMembers.length} Mitglied{teamMembers.length !== 1 ? 'er' : ''} in
                    diesem Workspace
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.settings.team.invite}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(member.user.name || member.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.user.name || member.user.email}
                        </p>
                        {member.user.name && (
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {t.settings.team.role[member.role as keyof typeof t.settings.team.role]}
                      </Badge>
                      {member.userId === context.user.id && (
                        <Badge variant="secondary">Sie</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Team-Einladungen sind in Kürze verfügbar
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t.settings.api.title}</CardTitle>
                  <CardDescription>{t.settings.api.description}</CardDescription>
                </div>
                {canEdit && (
                  <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.settings.api.createKey}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <EmptyState
                  icon={Key}
                  title={t.settings.api.noKeys}
                  description={t.settings.api.noKeysDescription}
                />
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                            {key.keyPrefix}••••••••
                          </code>
                          <span>•</span>
                          <span>Erstellt am {formatDate(key.createdAt)}</span>
                          {key.lastUsedAt && (
                            <>
                              <span>•</span>
                              <span>Zuletzt genutzt {formatDate(key.lastUsedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" disabled>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.api.webhooks.title}</CardTitle>
              <CardDescription>
                {t.settings.api.webhooks.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Keine Webhooks konfiguriert"
                description="Webhook-Konfiguration ist in Kürze verfügbar"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
