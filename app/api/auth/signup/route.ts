import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { createAdminSupabaseClient } from '@/lib/supabase'
import { signupSchema } from '@/lib/validators'
import { createTenantWithOwner, generateTenantSlug, isSlugAvailable } from '@/lib/tenant'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name, companyName } = validation.data

    // Prüfen ob User schon existiert
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ein Konto mit dieser E-Mail existiert bereits' },
        { status: 400 }
      )
    }

    // Tenant-Slug generieren und Verfügbarkeit prüfen
    let tenantSlug = generateTenantSlug(companyName)
    let attempts = 0
    while (!(await isSlugAvailable(tenantSlug)) && attempts < 10) {
      tenantSlug = `${generateTenantSlug(companyName)}-${Math.random().toString(36).slice(2, 6)}`
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Konnte keinen eindeutigen Firmennamen erstellen. Bitte anderen Namen wählen.' },
        { status: 400 }
      )
    }

    // Supabase User erstellen
    const supabase = createAdminSupabaseClient()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Für Demo: Auto-bestätigen
      user_metadata: { name },
    })

    if (authError) {
      console.error('Supabase Auth Error:', authError)
      return NextResponse.json(
        { error: 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      )
    }

    // Tenant + User + TenantUser in DB erstellen
    const { tenant, user, tenantUser } = await createTenantWithOwner(
      email,
      name,
      companyName,
      tenantSlug
    )

    // Session erstellen
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    // Für Demo: Direkt einloggen
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInData.session) {
      // Session Cookie setzen
      const cookieStore = cookies()
      cookieStore.set('sb-access-token', signInData.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 Tage
      })
      cookieStore.set('sb-refresh-token', signInData.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return NextResponse.json({
      success: true,
      tenantSlug: tenant.slug,
      userId: user.id,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
