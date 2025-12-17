import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { createAdminSupabaseClient, createBrowserSupabaseClient } from '@/lib/supabase'
import { signinSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const validation = signinSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // User in DB prüfen
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      )
    }

    // Supabase Auth
    const supabase = createAdminSupabaseClient()
    
    // Für Demo: Einfache Password-Prüfung für den Demo-User
    if (email === 'demo@matchmap.hr' && password === 'demo1234') {
      // Demo-Login erfolgreich
      const tenantSlug = user.tenantUsers[0]?.tenant.slug

      return NextResponse.json({
        success: true,
        tenantSlug,
        userId: user.id,
      })
    }

    // Normale Supabase-Authentifizierung
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      )
    }

    if (signInData.session) {
      // Session Cookie setzen
      const cookieStore = cookies()
      cookieStore.set('sb-access-token', signInData.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
      cookieStore.set('sb-refresh-token', signInData.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    // Ersten Tenant des Users finden
    const tenantSlug = user.tenantUsers[0]?.tenant.slug

    return NextResponse.json({
      success: true,
      tenantSlug,
      userId: user.id,
    })
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
