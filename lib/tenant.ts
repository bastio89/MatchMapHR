import { prisma } from './db'
import { getServerSession, AuthUser } from './supabase'
import { TenantRole, Tenant, User, TenantUser } from '@prisma/client'
import { redirect } from 'next/navigation'

// Erweiterter User mit Tenant-Kontext
export interface TenantContext {
  user: User
  tenant: Tenant
  tenantUser: TenantUser
  role: TenantRole
}

// Tenant aus Slug laden
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({
    where: { slug },
  })
}

// User aus Auth-ID laden (Supabase ID)
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Vollständigen Tenant-Kontext laden (für geschützte Routen)
export async function getTenantContext(tenantSlug: string): Promise<TenantContext | null> {
  // 1. Session prüfen
  const authUser = await getServerSession()
  if (!authUser) {
    return null
  }

  // 2. User in DB finden
  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  })
  if (!user) {
    return null
  }

  // 3. Tenant laden
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  })
  if (!tenant) {
    return null
  }

  // 4. TenantUser-Verbindung prüfen
  const tenantUser = await prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: user.id,
      },
    },
  })
  if (!tenantUser) {
    return null
  }

  return {
    user,
    tenant,
    tenantUser,
    role: tenantUser.role,
  }
}

// Require Tenant Context (redirect wenn nicht authentifiziert)
export async function requireTenantContext(tenantSlug: string): Promise<TenantContext> {
  const context = await getTenantContext(tenantSlug)
  
  if (!context) {
    redirect('/auth/signin')
  }
  
  return context
}

// RBAC: Prüfen ob User bestimmte Rolle hat
export function hasRole(context: TenantContext, requiredRoles: TenantRole[]): boolean {
  return requiredRoles.includes(context.role)
}

// RBAC: Require spezifische Rolle
export async function requireRole(tenantSlug: string, requiredRoles: TenantRole[]): Promise<TenantContext> {
  const context = await requireTenantContext(tenantSlug)
  
  if (!hasRole(context, requiredRoles)) {
    redirect(`/t/${tenantSlug}/app/dashboard?error=unauthorized`)
  }
  
  return context
}

// Hilfsfunktionen für RBAC
export function isOwner(context: TenantContext): boolean {
  return context.role === TenantRole.OWNER
}

export function isAdmin(context: TenantContext): boolean {
  return context.role === TenantRole.OWNER || context.role === TenantRole.ADMIN
}

export function canManageTeam(context: TenantContext): boolean {
  return isAdmin(context)
}

export function canManageSettings(context: TenantContext): boolean {
  return isAdmin(context)
}

export function canCreateRequests(context: TenantContext): boolean {
  return true // Alle Rollen können Requests erstellen
}

// Tenant für einen User erstellen (bei Signup)
export async function createTenantWithOwner(
  email: string,
  name: string,
  tenantName: string,
  tenantSlug: string
): Promise<{ tenant: Tenant; user: User; tenantUser: TenantUser }> {
  // Transaktion für atomare Erstellung
  return prisma.$transaction(async (tx) => {
    // 1. User erstellen
    const user = await tx.user.create({
      data: {
        email,
        name,
      },
    })

    // 2. Tenant erstellen
    const tenant = await tx.tenant.create({
      data: {
        name: tenantName,
        slug: tenantSlug,
      },
    })

    // 3. TenantUser als Owner
    const tenantUser = await tx.tenantUser.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        role: TenantRole.OWNER,
      },
    })

    return { tenant, user, tenantUser }
  })
}

// Slug aus Firmenname generieren
export function generateTenantSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => {
      const map: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

// Prüfen ob Slug verfügbar ist
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await prisma.tenant.findUnique({
    where: { slug },
  })
  return !existing
}
