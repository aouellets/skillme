import { NextRequest, NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/** Only allow same-origin, in-app redirect targets (prevents open redirects). */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/'
  return next
}

/**
 * Auth redirect target. Handles both:
 *  - OAuth + PKCE magic links (`?code=...`) via exchangeCodeForSession
 *  - OTP-style email links (`?token_hash=...&type=...`) via verifyOtp
 * On failure, bounces back to /login with an error code instead of a dead end.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = safeNext(searchParams.get('next'))
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=callback`)
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=exchange`)
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=exchange`)
  }

  return NextResponse.redirect(`${origin}/login?error=callback`)
}
