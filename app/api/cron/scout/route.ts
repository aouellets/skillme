import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { sendAdminAlert } from '@/lib/email'
import {
  DISCOVERY_TOPICS,
  existingSkillSlugs,
  ingestRepo,
  repoAlreadyKnown,
  searchTrendingRepos,
  type SkillResult,
} from '@/lib/ingest'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Weekly headless skill discovery — the automated half of the hybrid pipeline.
 *
 * Sweeps GitHub's skill topics for recently-active, permissively-licensed repos
 * the catalog does not yet carry, runs each through the shared ingest engine
 * (license + Claude safety gate), and auto-publishes the survivors. The judgment
 * half — scoring, dedup nuance, gap analysis, and pack curation — is handled
 * separately by the weekly `skill-scout` Claude routine.
 *
 * Bounded per run (`MAX_REPOS` × `MAX_SKILLS_PER_REPO`) so a single tick can't
 * flood the catalog or blow the function timeout. Multi-skill repos are ingested
 * as individual skills; packaging them is left to the curation routine.
 *
 * Protected by CRON_SECRET (Bearer header from Vercel Cron, or ?secret=).
 */
const MAX_REPOS = 6
const MAX_SKILLS_PER_REPO = 8
const PUSHED_WINDOW_DAYS = 14

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    const qp = req.nextUrl.searchParams.get('secret')
    if (auth !== `Bearer ${secret}` && qp !== secret) {
      return Response.json({ error: 'Unauthorized.' }, { status: 401 })
    }
  }

  const supabase = getServiceSupabase()
  if (!supabase) return Response.json({ error: 'Database not configured.' }, { status: 503 })
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Classifier not configured (ANTHROPIC_API_KEY).' }, { status: 503 })
  }

  const since = new Date(Date.now() - PUSHED_WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10)

  try {
    const [trending, existing] = await Promise.all([
      searchTrendingRepos(DISCOVERY_TOPICS, since),
      existingSkillSlugs(supabase),
    ])

    const fresh = trending.filter((r) => !repoAlreadyKnown(r.owner, r.repo, existing)).slice(0, MAX_REPOS)

    const published: SkillResult[] = []
    const perRepo: { repo: string; published: number; skipped?: string }[] = []

    for (const cand of fresh) {
      const result = await ingestRepo(
        supabase,
        { owner: cand.owner, repo: cand.repo },
        { maxSkills: MAX_SKILLS_PER_REPO }
      )
      const ok = result.skills.filter((s) => s.status === 'added' || s.status === 'updated')
      published.push(...ok)
      perRepo.push({ repo: `${cand.owner}/${cand.repo}`, published: ok.length, skipped: result.skipped })
    }

    const summary = {
      ok: true,
      scanned: trending.length,
      candidates: fresh.length,
      published: published.length,
      since,
      ran_at: new Date().toISOString(),
      repos: perRepo,
    }

    if (published.length > 0) {
      await sendAdminAlert(
        `Skill Scout: ${published.length} new skill(s) auto-published`,
        [
          `Window: repos pushed since ${since}`,
          `Scanned ${trending.length} trending repos, ${fresh.length} were new.`,
          '',
          ...perRepo.map((r) => `• ${r.repo}: ${r.skipped ? `skipped (${r.skipped})` : `${r.published} published`}`),
          '',
          ...published.map((s) => `  ✓ ${s.name ?? s.slug} (${s.slug})`),
          '',
          'These are live and verified. Review at skillme.dev/admin and unpublish anything off-base.',
        ]
      )
    }

    return Response.json(summary)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[cron/scout] failed:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
