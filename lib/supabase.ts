import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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

// Session aus Supabase holen (Server-side)
export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session?.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name,
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
