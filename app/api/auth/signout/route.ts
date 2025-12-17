import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Cookies löschen
  const cookieStore = cookies()
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')

  // Redirect zur Landing Page
  return NextResponse.redirect(new URL('/', request.url))
}
