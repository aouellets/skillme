import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = getSupabase()

  if (!supabase) {
    return Response.json({ total_installs: 0, total_skills: 0, total_packs: 0 })
  }

  const [skillsResult, installsResult, packsResult] = await Promise.all([
    supabase.from('skills').select('id', { count: 'exact', head: true }),
    supabase.from('user_installs').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('packs').select('id', { count: 'exact', head: true }),
  ])

  return Response.json({
    total_skills: skillsResult.count ?? 0,
    total_installs: installsResult.count ?? 0,
    total_packs: packsResult.count ?? 0,
    updated_at: new Date().toISOString(),
  })
}
