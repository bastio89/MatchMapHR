import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// Supabase Client für Server Components
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Supabase Client für Client Components
export function createBrowserSupabaseClient() {
  return createClientComponentClient()
}

// Supabase Admin Client (für Server-seitige Operationen ohne Auth)
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Typen für Auth User
export interface AuthUser {
  id: string
  email: string
  name?: string
}

// Session aus JWT Token validieren (Server-side)
export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    
    // Supabase Auth Helpers Cookie-Namen
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]
    const accessTokenKey = `sb-${projectRef}-auth-token`
    
    const accessToken = cookieStore.get(accessTokenKey)
    
    if (!accessToken?.value) {
      console.log('No access token found in cookies')
      return null
    }

    // JWT Secret aus Environment
    const jwtSecret = process.env.SUPABASE_JWT_SECRET
    if (!jwtSecret) {
      console.error('SUPABASE_JWT_SECRET not configured')
      return null
    }

    // Token ist ein JSON String mit access_token
    let tokenValue: string
    try {
      const parsed = JSON.parse(accessToken.value)
      tokenValue = parsed.access_token || parsed
    } catch {
      tokenValue = accessToken.value
    }

    // Token verifizieren
    const decoded = jwt.verify(tokenValue, jwtSecret) as any
    
    if (!decoded.sub || !decoded.email) {
      return null
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.user_metadata?.name,
    }
  } catch (error) {
    console.error('Error validating JWT token:', error)
    return null
  }
}
