/**
 * Seed the Skill Me catalog with the launch skills.
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
import { resolveSourceUrl } from '../lib/skill-source'

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
    source_url: resolveSourceUrl(s) ?? null,
    author: s.author,
    skill_content: s.skill_content,
    // install_count / rating_avg / rating_count are intentionally omitted:
    // they are runtime-accumulated (install_skill RPC + recompute_skill_rating)
    // and DB-owned. Seeding must never write them, or every db:seed would
    // overwrite real engagement with authored placeholder numbers.
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

  // Upsert in batches — a single upsert of the full catalog (2k+ rows, each with
  // a large skill_content) exceeds Postgres's statement_timeout. Chunking keeps
  // each statement well under the limit and lets a failure point at its batch.
  const BATCH = 100
  let seeded = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH)
    const { data, error } = await supabase
      .from('skills')
      .upsert(chunk, { onConflict: 'slug' })
      .select('slug')
    if (error) {
      console.error(`Seed failed on batch ${i}-${i + chunk.length}:`, error.message)
      process.exit(1)
    }
    seeded += data?.length ?? chunk.length
    console.log(`  · ${seeded}/${rows.length}`)
  }

  console.log(`Seeded ${seeded} skills. Done.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
