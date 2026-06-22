/**
 * One-shot: publish the Stock & Visual Asset Sourcing pack demo.
 * Uploads MP4 + poster to the `demos` bucket, points a media_assets
 * pack/landscape row (subject pack/stock-asset-sourcing) at them, and sets the
 * pack's static card art (poster) + alt text.
 *
 *   node scripts/upload-stock-demo.mjs
 */
import { readFileSync, statSync } from 'node:fs'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
const sb = createClient(url, key, { auth: { persistSession: false } })

const BUCKET = 'demos'
const SLUG = 'stock-asset-sourcing'
const stamp = '2026-06-22-stock-v1'
const VIDEO_KEY = `pack/${SLUG}/landscape-${stamp}.mp4`
const POSTER_KEY = `pack/${SLUG}/landscape-${stamp}.jpg`
const BASE = 'remotion-skillme-ai-engineer/out'
const DURATION_MS = Math.round((790 / 30) * 1000)

async function up(localPath, key, contentType) {
  const body = readFileSync(localPath)
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(key, body, { contentType, upsert: true, cacheControl: '31536000' })
  if (error) throw new Error(`upload ${key}: ${error.message}`)
  const { data } = sb.storage.from(BUCKET).getPublicUrl(key)
  console.log(`✓ uploaded ${key}`)
  return data.publicUrl
}

const videoUrl = await up(`${BASE}/stock-pack.mp4`, VIDEO_KEY, 'video/mp4')
const posterUrl = await up(`${BASE}/stock-pack-poster.jpg`, POSTER_KEY, 'image/jpeg')
const bytes = statSync(`${BASE}/stock-pack.mp4`).size

// Replace any existing pack/landscape demo row, then insert the fresh one.
await sb
  .from('media_assets')
  .delete()
  .eq('subject_type', 'pack')
  .eq('subject_slug', SLUG)
  .eq('orientation', 'landscape')

const { data: row, error: insErr } = await sb
  .from('media_assets')
  .insert({
    subject_type: 'pack',
    subject_slug: SLUG,
    orientation: 'landscape',
    kind: 'demo',
    url: videoUrl,
    poster_url: posterUrl,
    width: 1920,
    height: 1080,
    duration_ms: DURATION_MS,
    bytes,
  })
  .select('id, url')
  .single()
if (insErr) throw new Error(`media_assets insert: ${insErr.message}`)
console.log('✓ media_assets pack/landscape row:', JSON.stringify(row, null, 2))

// `packs` has no thumbnail_video column (skills-only); the demo plays from the
// media_assets row above. Here we set the pack's static card art + alt text.
const { error: upErr } = await sb
  .from('packs')
  .update({ thumbnail_url: posterUrl, media_alt: 'Stock & Visual Asset Sourcing pack — animated demo' })
  .eq('slug', SLUG)
if (upErr) throw new Error(`packs update: ${upErr.message}`)
console.log('✓ packs.thumbnail_url (poster) + media_alt set')
console.log('Done.')
