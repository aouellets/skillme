/**
 * Backfill embeddings for every skill and pack so the semantic recommender can
 * do cosine top-k (migration 0009). Idempotent and cheap to re-run: each row
 * stores a hash of its embedding input, and rows whose input is unchanged (and
 * already have a vector) are skipped — so a routine run after `db:seed` /
 * `db:seed-packs` only embeds what actually changed.
 *
 * Usage:
 *   npm run embed:catalog                 # embed new/changed rows
 *   tsx scripts/embed-catalog.ts --all    # re-embed everything (e.g. model change)
 *   tsx scripts/embed-catalog.ts --dry-run
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (writes), and
 * AI_GATEWAY_API_KEY (embeddings) in .env.local.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import {
  EMBEDDING_MODEL,
  isEmbeddingConfigured,
  skillEmbeddingInput,
  packEmbeddingInput,
  embeddingHash,
  embedTexts,
} from '../lib/embeddings'

config({ path: '.env.local' })
config()

const args = process.argv.slice(2)
const FORCE = args.includes('--all')
const DRY = args.includes('--dry-run')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

/** How many inputs to embed per gateway call. */
const BATCH = 96

interface Pending {
  table: 'skills' | 'packs'
  id: string
  name: string
  input: string
  hash: string
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function main() {
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local.')
    process.exit(1)
  }
  if (!isEmbeddingConfigured()) {
    console.error('Missing AI_GATEWAY_API_KEY — cannot compute embeddings.')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  console.log(`Embedding model: ${EMBEDDING_MODEL}${FORCE ? '  (--all: re-embedding everything)' : ''}`)

  // ── Gather pending work ────────────────────────────────────────────────
  const pending: Pending[] = []

  // Skills
  const { data: skills, error: skillErr } = await supabase
    .from('skills')
    .select('id, name, description, category, tags, skill_content, embedding, embedding_hash')
  if (skillErr) throw new Error(`Fetch skills failed: ${skillErr.message}`)
  for (const s of skills ?? []) {
    const input = skillEmbeddingInput(s)
    const hash = embeddingHash(input)
    const fresh = !FORCE && s.embedding != null && s.embedding_hash === hash
    if (!fresh) pending.push({ table: 'skills', id: s.id, name: s.name, input, hash })
  }

  // Packs — member skill names give a pack its semantic footprint.
  const { data: members, error: memErr } = await supabase
    .from('pack_skills')
    .select('pack_id, skills(name)')
  if (memErr) throw new Error(`Fetch pack_skills failed: ${memErr.message}`)
  const namesByPack = new Map<string, string[]>()
  // PostgREST types an embedded resource as an array even when the FK is
  // to-one, so normalise object-or-array before reading names.
  for (const m of (members ?? []) as Array<{ pack_id: string; skills: unknown }>) {
    const rel = m.skills
    const names = (Array.isArray(rel) ? rel : rel ? [rel] : []) as Array<{ name?: string }>
    for (const r of names) {
      if (!r?.name) continue
      const list = namesByPack.get(m.pack_id) ?? []
      list.push(r.name)
      namesByPack.set(m.pack_id, list)
    }
  }

  const { data: packs, error: packErr } = await supabase
    .from('packs')
    .select('id, name, tagline, description, category, tags, embedding, embedding_hash')
  if (packErr) throw new Error(`Fetch packs failed: ${packErr.message}`)
  for (const p of packs ?? []) {
    const input = packEmbeddingInput(p, namesByPack.get(p.id) ?? [])
    const hash = embeddingHash(input)
    const fresh = !FORCE && p.embedding != null && p.embedding_hash === hash
    if (!fresh) pending.push({ table: 'packs', id: p.id, name: p.name, input, hash })
  }

  const skillTotal = skills?.length ?? 0
  const packTotal = packs?.length ?? 0
  const skillPending = pending.filter((p) => p.table === 'skills').length
  const packPending = pending.length - skillPending
  console.log(
    `Skills: ${skillPending}/${skillTotal} to embed (${skillTotal - skillPending} unchanged).  ` +
      `Packs: ${packPending}/${packTotal} to embed (${packTotal - packPending} unchanged).`
  )

  if (pending.length === 0) {
    console.log('Nothing to embed. Catalog embeddings are up to date.')
    return
  }
  if (DRY) {
    console.log('[dry-run] Would embed:')
    for (const p of pending) console.log(`  ${p.table.padEnd(6)} ${p.name}`)
    return
  }

  // ── Embed in batches, write back ───────────────────────────────────────
  let done = 0
  for (const batch of chunk(pending, BATCH)) {
    const vectors = await embedTexts(batch.map((b) => b.input))
    for (let i = 0; i < batch.length; i++) {
      const row = batch[i]
      // pgvector accepts the bracketed JSON form `[1,2,3]` as a text→vector cast;
      // stringify so PostgREST sends that rather than a Postgres array literal.
      const embedding = JSON.stringify(vectors[i])
      const { error } = await supabase
        .from(row.table)
        .update({ embedding, embedding_hash: row.hash })
        .eq('id', row.id)
      if (error) {
        console.error(`  ✗ ${row.table} ${row.name}: ${error.message}`)
      } else {
        done++
      }
    }
    console.log(`  embedded ${done}/${pending.length}…`)
  }

  console.log(`Done. Wrote embeddings for ${done}/${pending.length} rows.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
