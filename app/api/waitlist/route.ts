import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  // Try to store in Supabase waitlist table
  const supabase = getServiceSupabase()
  if (supabase) {
    const { error } = await supabase
      .from('waitlist')
      .upsert({ email, created_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error && error.code !== '42P01') {
      // 42P01 = table doesn't exist yet — graceful fallback
      console.error('[waitlist] upsert error:', error.message)
    }
  }

  // Always succeed from the user's perspective — even if DB fails
  console.log('[waitlist] signup:', email)

  return Response.json({
    ok: true,
    message: 'You\'re on the list. We\'ll email you when new skill packs drop.',
  })
}
