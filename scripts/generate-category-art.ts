/**
 * Writes the per-category placeholder art to `public/category/<key>.svg` from
 * the shared definitions in `lib/category-art.ts`. These are the same SVGs the
 * thumbnail component renders inline; emitting files lets them be reused as
 * static assets (OG images, `thumbnail_url`, docs, manual sharing).
 *
 * Run with: npx tsx scripts/generate-category-art.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORY_ART, categoryThumbnailSvg, categoryVariantCount } from '../lib/category-art'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'category')

function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const keys = Object.keys(CATEGORY_ART)
  let n = 0
  for (const key of keys) {
    const variants = categoryVariantCount(key)
    for (let v = 0; v < variants; v++) {
      // <key>.svg is the canonical variant 0; <key>-1.svg, <key>-2.svg, ... are the rest.
      const name = v === 0 ? `${key}.svg` : `${key}-${v}.svg`
      writeFileSync(join(OUT_DIR, name), categoryThumbnailSvg(key, { variant: v }) + '\n')
      n++
    }
  }
  console.log(`Wrote ${n} category SVGs (${keys.length} categories x variants) to public/category/`)
}

main()
