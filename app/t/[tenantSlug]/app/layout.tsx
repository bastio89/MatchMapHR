import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Settings,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react'
import { requireTenantContext } from '@/lib/tenant'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import t from '@/lib/i18n'

interface AppLayoutProps {
  children: React.ReactNode
  params: { tenantSlug: string }
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { tenantSlug } = params
  
  // Tenant Context laden und Auth prüfen
  const context = await requireTenantContext(tenantSlug)
  
  const navigation = [
    {
      name: t.dashboard.title,
      href: `/t/${tenantSlug}/app/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: t.requests.newRequest,
      href: `/t/${tenantSlug}/app/new-request`,
      icon: PlusCircle,
    },
    {
      name: t.requests.title,
      href: `/t/${tenantSlug}/app/requests`,
      icon: FolderOpen,
    },
    {
      name: t.settings.title,
      href: `/t/${tenantSlug}/app/settings`,
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-background lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold">{t.common.appName}</span>
        </div>

        {/* Tenant Name */}
        <div className="border-b px-4 py-3">
          <p className="truncate text-sm font-medium">{context.tenant.name}</p>
          <p className="text-xs text-muted-foreground">
            {context.tenant.plan} Plan
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={context.user.avatarUrl || undefined} />
                  <AvatarFallback>
                    {getInitials(context.user.name || context.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="truncate text-sm font-medium">
                    {context.user.name || context.user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {context.role}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/t/${tenantSlug}/app/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t.settings.title}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout" className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.auth.signout}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href={`/t/${tenantSlug}/app/dashboard`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold">{t.common.appName}</span>
        </Link>
        {/* Mobile menu button - simplified for now */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navigation.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout" className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t.auth.signout}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="min-h-screen pt-16 lg:pt-0">
          <div className="container py-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
