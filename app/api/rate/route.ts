import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServiceSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Record a 1–5 rating for the signed-in user against a skill, then refresh the
 * skill's public average. Web ratings are keyed by the authenticated user id.
 */
export async function POST(req: NextRequest) {
  const auth = await createSupabaseServerClient()
  if (!auth) {
    return Response.json({ error: 'Auth is not configured.' }, { status: 503 })
  }

  const {
    data: { user },
  } = await auth.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Sign in to rate skills.' }, { status: 401 })
  }

  let body: { skill_id?: string; rating?: number }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const rating = Number(body.rating)
  if (!body.skill_id || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json(
      { error: 'A skill_id and an integer rating from 1 to 5 are required.' },
      { status: 400 }
    )
  }

  const service = getServiceSupabase()
  if (!service) {
    return Response.json({ error: 'Database is not configured.' }, { status: 503 })
  }

  const userToken = `auth:${user.id}`

  const { error: upsertError } = await service.from('user_installs').upsert(
    {
      user_token: userToken,
      skill_id: body.skill_id,
      rating,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_token,skill_id' }
  )
  if (upsertError) {
    return Response.json({ error: upsertError.message }, { status: 500 })
  }

  await service.rpc('recompute_skill_rating', { p_skill_id: body.skill_id })

  const { data: skill } = await service
    .from('skills')
    .select('rating_avg, rating_count')
    .eq('id', body.skill_id)
    .single()

  return Response.json({
    ok: true,
    rating,
    rating_avg: skill?.rating_avg ?? null,
    rating_count: skill?.rating_count ?? null,
  })
}
