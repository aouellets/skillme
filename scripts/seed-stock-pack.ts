/**
 * Targeted seed for the "Stock & Visual Asset Sourcing" pack.
 *
 * The full `npm run db:seed` upserts the entire 2k-skill catalog and times out,
 * so this script seeds only the four new skills and the one pack (skills first,
 * then the pack + pack_skills join rows). Idempotent: safe to re-run.
 *
 *   npx tsx scripts/seed-stock-pack.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and a service-role (or anon) key in .env.local.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { SEED_SKILLS } from '../lib/seed-data'
import { resolveSourceUrl } from '../lib/skill-source'
import { PACK_DEFINITIONS } from '../lib/pack-definitions'

config({ path: '.env.local' })
config()

const PACK_SLUG = 'stock-asset-sourcing'
const SKILL_SLUGS = [
  'stock-photo-finder',
  'image-license-rights',
  'stock-photo-api',
  'visual-asset-curation',
]

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  if (!url || !key) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  // 1. Upsert the four skills.
  const skills = SEED_SKILLS.filter((s) => SKILL_SLUGS.includes(s.slug))
  if (skills.length !== SKILL_SLUGS.length) {
    console.error(`Expected ${SKILL_SLUGS.length} skills in SEED_SKILLS, found ${skills.length}. Run npm run build:catalog.`)
    process.exit(1)
  }
  const rows = skills.map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: s.category,
    source_url: resolveSourceUrl(s) ?? null,
    author: s.author,
    skill_content: s.skill_content,
    verified: s.verified,
    featured: s.featured,
    free: true,
    tags: s.tags,
  }))
  const { data: seeded, error: skillErr } = await supabase
    .from('skills')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug')
  if (skillErr) {
    console.error('Skill seed failed:', skillErr.message)
    process.exit(1)
  }
  console.log(`Seeded ${seeded?.length ?? rows.length} skills:`)
  for (const r of rows) console.log(`  · ${r.slug}`)

  // 2. Upsert the pack, then rebuild its pack_skills join rows in order.
  const packDef = PACK_DEFINITIONS.find((p) => p.slug === PACK_SLUG)
  if (!packDef) {
    console.error(`Pack ${PACK_SLUG} not found in PACK_DEFINITIONS`)
    process.exit(1)
  }
  const { skill_slugs, install_count: _ic, ...packData } = packDef
  const { data: pack, error: packErr } = await supabase
    .from('packs')
    .upsert(packData, { onConflict: 'slug' })
    .select('id, slug')
    .single()
  if (packErr || !pack) {
    console.error(`Pack seed failed: ${packErr?.message}`)
    process.exit(1)
  }

  const { data: skillIds, error: lookupErr } = await supabase
    .from('skills')
    .select('id, slug')
    .in('slug', skill_slugs)
  if (lookupErr) {
    console.error(`Skill lookup failed: ${lookupErr.message}`)
    process.exit(1)
  }
  const found = new Set((skillIds ?? []).map((s: { slug: string }) => s.slug))
  const missing = skill_slugs.filter((s) => !found.has(s))
  if (missing.length) {
    console.error(`Pack skills not found: ${missing.join(', ')}`)
    process.exit(1)
  }
  const packSkills = (skillIds ?? []).map((s: { id: string; slug: string }) => ({
    pack_id: pack.id,
    skill_id: s.id,
    position: skill_slugs.indexOf(s.slug),
  }))
  await supabase.from('pack_skills').delete().eq('pack_id', pack.id)
  const { error: psErr } = await supabase.from('pack_skills').insert(packSkills)
  if (psErr) {
    console.error(`pack_skills insert failed: ${psErr.message}`)
    process.exit(1)
  }
  console.log(`Seeded pack ${pack.slug} (${packSkills.length} skills).`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
