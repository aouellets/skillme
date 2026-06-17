import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Only allow in non-production or with a secret token
  const token = req.nextUrl.searchParams.get('token')
  if (token !== process.env.DEBUG_TOKEN && process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return Response.json({
      status: 'no_supabase',
      env: {
        url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      },
    })
  }

  const { data, error, count } = await supabase
    .from('skills')
    .select('id, slug, name', { count: 'exact' })
    .limit(3)

  return Response.json({
    status: error ? 'error' : 'ok',
    skill_count: count,
    sample: data,
    error: error?.message ?? null,
    error_code: error?.code ?? null,
  })
}
