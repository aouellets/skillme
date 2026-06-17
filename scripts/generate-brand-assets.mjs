// Generates branded PNG assets from inline SVG using @resvg/resvg-js.
//   - public/ph-thumbnail.png  (240x240)  Product Hunt thumbnail
//   - public/og-default.png    (1200x630) default social share card
// Run: node scripts/generate-brand-assets.mjs
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')
mkdirSync(PUBLIC, { recursive: true })

const VOID = '#0E0F11'
const SURFACE = '#16181C'
const BORDER = '#2A2D35'
const AMBER = '#E8A832'
const GRAY = '#9AA0AD'
const TEXT = '#F2F3F5'
const TEXT_2 = '#9AA0AD'

// SkillShelf lettermark: dark rounded tile with amber/gray "shelf" bars.
function mark(size) {
  const s = size
  const k = s / 64 // scale from the 64px source icon
  const r = (v) => +(v * k).toFixed(2)
  return `
    <rect width="${s}" height="${s}" rx="${r(12)}" fill="${SURFACE}" />
    <rect x="${r(8)}" y="${r(8)}" width="${r(48)}" height="${r(48)}" rx="${r(9)}"
          fill="none" stroke="${BORDER}" stroke-width="${r(2)}" />
    <rect x="${r(16)}" y="${r(18)}"   width="${r(32)}" height="${r(5)}" rx="${r(1.5)}" fill="${AMBER}" />
    <rect x="${r(16)}" y="${r(29.5)}" width="${r(24)}" height="${r(5)}" rx="${r(1.5)}" fill="${GRAY}" />
    <rect x="${r(16)}" y="${r(41)}"   width="${r(32)}" height="${r(5)}" rx="${r(1.5)}" fill="${AMBER}" />`
}

const thumbnail = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <rect width="240" height="240" fill="${VOID}" />
  <g transform="translate(20 20)">${mark(200)}</g>
</svg>`

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${VOID}" />
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="${BORDER}" />
  <g transform="translate(96 195)">${mark(240)}</g>
  <text x="396" y="270" fill="${TEXT}" font-family="Georgia, 'Times New Roman', serif"
        font-size="84">SkillShelf</text>
  <text x="398" y="330" fill="${AMBER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="40">The App Store for Claude Skills</text>
  <text x="398" y="392" fill="${TEXT_2}" font-family="Helvetica, Arial, sans-serif"
        font-size="28">300+ curated skills · Connect once, install anything</text>
</svg>`

function render(svg, width, outfile) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  const png = resvg.render().asPng()
  writeFileSync(resolve(PUBLIC, outfile), png)
  console.log(`wrote public/${outfile} (${png.length} bytes)`)
}

render(thumbnail, 240, 'ph-thumbnail.png')
render(og, 1200, 'og-default.png')
