/**
 * Seeds Skill Me with launch packs.
 * Run: npm run db:seed-packs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Skills must already be seeded (npm run db:seed) before running this.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { PACK_DEFINITIONS } from '../lib/pack-definitions'

config({ path: '.env.local' })
config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function main() {
  if (!url || !key) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  console.log(`Seeding ${PACK_DEFINITIONS.length} packs...`)

  for (const packDef of PACK_DEFINITIONS) {
    const { skill_slugs, ...packData } = packDef

    // Upsert the pack
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .upsert(packData, { onConflict: 'slug' })
      .select('id, slug')
      .single()

    if (packError || !pack) {
      console.error(`  ✗ ${packDef.slug}: ${packError?.message}`)
      continue
    }

    // Look up skill IDs by slug
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, slug')
      .in('slug', skill_slugs)

    if (skillsError) {
      console.error(`  ✗ skill lookup for ${packDef.slug}: ${skillsError.message}`)
      continue
    }

    const foundSlugs = new Set((skills ?? []).map((s: { slug: string }) => s.slug))
    const missingSlugs = skill_slugs.filter((s) => !foundSlugs.has(s))
    if (missingSlugs.length > 0) {
      console.warn(`  ⚠ ${packDef.slug}: skills not found (run db:seed first): ${missingSlugs.join(', ')}`)
    }

    // Build pack_skills rows in the defined order
    const packSkills = (skills ?? []).map((skill: { id: string; slug: string }) => ({
      pack_id: pack.id,
      skill_id: skill.id,
      position: skill_slugs.indexOf(skill.slug),
    }))

    if (packSkills.length > 0) {
      // Remove existing pack_skills for this pack, then re-insert
      await supabase.from('pack_skills').delete().eq('pack_id', pack.id)
      const { error: psError } = await supabase.from('pack_skills').insert(packSkills)
      if (psError) {
        console.error(`  ✗ pack_skills for ${packDef.slug}: ${psError.message}`)
        continue
      }
    }

    console.log(`  ✓ ${pack.slug} (${packSkills.length} skills)`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
