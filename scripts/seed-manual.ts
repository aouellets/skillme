/**
 * Seed the SkillShelf catalog with the launch skills.
 *
 * Usage:
 *   npm run db:seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and a service-role (or anon) key in
 * .env.local. Run supabase/schema.sql first.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { SEED_SKILLS } from '../lib/seed-data'

config({ path: '.env.local' })
config() // fall back to .env

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  if (!url || !key) {
    console.error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local.'
    )
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const rows = SEED_SKILLS.map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: s.category,
    source_url: s.source_url ?? null,
    author: s.author,
    skill_content: s.skill_content,
    install_count: s.install_count,
    rating_avg: s.rating_avg,
    rating_count: s.rating_count,
    verified: s.verified,
    featured: s.featured,
    free: true,
    tags: s.tags,
    thumbnail_url:    s.thumbnail_url    ?? null,
    thumbnail_gif:    s.thumbnail_gif    ?? null,
    thumbnail_video:  s.thumbnail_video  ?? null,
    thumbnail_lottie: s.thumbnail_lottie ?? null,
    media_alt:        s.media_alt        ?? null,
  }))

  console.log(`Seeding ${rows.length} skills…`)

  const { data, error } = await supabase
    .from('skills')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Seeded ${data?.length ?? rows.length} skills:`)
  for (const r of rows) console.log(`  · ${r.slug}`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
