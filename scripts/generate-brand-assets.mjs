// Generates branded PNG assets from inline SVG using @resvg/resvg-js.
//   - public/favicon-16x16.png   (16x16)
//   - public/favicon-32x32.png   (32x32)
//   - public/apple-touch-icon.png(180x180)
//   - public/ph-thumbnail.png    (240x240)  Product Hunt thumbnail
//   - public/og-default.png      (1200x630) default social share card
// Run: node scripts/generate-brand-assets.mjs
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')
mkdirSync(PUBLIC, { recursive: true })

const VOID = '#080a0a'
const SURFACE = '#101413'
const BORDER = '#323a37'
const LIME = '#b4f33e'
const TEXT = '#f5f7f5'
const TEXT_2 = '#9ba29d'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"

// Skill Me lettermark: dark rounded tile with an ascending lime pulse line.
// Coordinates live in a 32-unit space (mirrors app/icon.svg and components/Logo).
function mark(size) {
  const k = size / 32
  const r = (v) => +(v * k).toFixed(2)
  const sw = (v) => +(v * k).toFixed(2)
  return `
    <rect width="${size}" height="${size}" rx="${r(9)}" fill="${SURFACE}" />
    <rect x="${r(0.75)}" y="${r(0.75)}" width="${r(30.5)}" height="${r(30.5)}" rx="${r(8.25)}"
          fill="none" stroke="${BORDER}" stroke-width="${sw(1.5)}" />
    <path d="M${r(6)} ${r(21.5)} L${r(11)} ${r(21.5)} L${r(13.5)} ${r(11)} L${r(17)} ${r(24)} L${r(19.5)} ${r(16.5)} L${r(21.5)} ${r(16.5)}"
          fill="none" stroke="${LIME}" stroke-width="${sw(2.2)}" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="${r(24.5)}" cy="${r(16.5)}" r="${r(2)}" fill="${LIME}" />`
}

const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mark(size)}
</svg>`

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
  <text x="396" y="270" fill="${TEXT}" font-family="${SANS}" font-weight="600"
        font-size="84">Skill <tspan fill="${LIME}">Me</tspan></text>
  <text x="398" y="330" fill="${TEXT_2}" font-family="${SANS}"
        font-size="40">The App Store for Claude Skills</text>
  <text x="398" y="392" fill="${TEXT_2}" font-family="${SANS}"
        font-size="28">300+ curated skills · Connect once, install anything</text>
</svg>`

function render(svg, width, outfile) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  const png = resvg.render().asPng()
  writeFileSync(resolve(PUBLIC, outfile), png)
  console.log(`wrote public/${outfile} (${png.length} bytes)`)
}

render(icon(16), 16, 'favicon-16x16.png')
render(icon(32), 32, 'favicon-32x32.png')
render(icon(180), 180, 'apple-touch-icon.png')
render(thumbnail, 240, 'ph-thumbnail.png')
render(og, 1200, 'og-default.png')
