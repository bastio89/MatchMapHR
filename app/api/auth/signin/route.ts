import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'
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

    // Supabase Admin Client erstellen
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Supabase-Authentifizierung
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error('Supabase signin error:', signInError.message)
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      )
    }

    // Ersten Tenant des Users finden
    const tenantSlug = user.tenantUsers[0]?.tenant.slug

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Kein Tenant zugeordnet' },
        { status: 400 }
      )
    }

    // Erfolgreiche Anmeldung
    const response = NextResponse.json({
      success: true,
      tenantSlug,
      userId: user.id,
    })

    // Session Token als Cookie setzen (Supabase Auth Helpers Format)
    if (signInData.session) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
      const cookieName = `sb-${projectRef}-auth-token`
      
      // Auth Helpers speichern Session als JSON
      const sessionData = JSON.stringify({
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_at: signInData.session.expires_at,
        expires_in: signInData.session.expires_in,
        token_type: signInData.session.token_type,
        user: signInData.session.user,
      })
      
      response.cookies.set(cookieName, sessionData, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return response
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
