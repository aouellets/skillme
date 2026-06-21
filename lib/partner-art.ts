/**
 * Branded placeholder art for official partner packs/skills ("skills straight
 * from the source"). Where `category-art.ts` paints a generic category scene,
 * this paints the *company*: their brand mark as the hero, lit by their brand
 * color, with the category name as the supporting label. The logo answers
 * "who built this", the label answers "what is it" — so a partner card reads
 * as visually distinct from a plain category placeholder at a glance.
 *
 * Self-contained animated SVG (SMIL): a slow-pulsing brand glow and two
 * counter-rotating dashed orbit rings keep it feeling alive without media.
 * Used by `components/SkillThumbnail.tsx` for partner authors with no media.
 */
import { getPartner } from './partners'
import { isCategoryArtKey, CATEGORY_ART } from './category-art'

const VOID = '#080a0a'

/** True when we can render branded art for this author (known partner). */
export function hasPartnerArt(author?: string | null): boolean {
  return getPartner(author) !== null
}

/** Stable FNV-1a hash → non-negative int (id uniqueness, deterministic SSR). */
function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * The hero brand mark, centered in a 24-unit box scaled into the art. Microsoft
 * is special-cased into its four real brand colors; every other mark renders in
 * its single brand color.
 */
function logoMarkup(author: string, viewBox: string, path: string, color: string): string {
  if (author === 'Microsoft') {
    return (
      '<rect x="1" y="1" width="10" height="10" fill="#f25022"/>' +
      '<rect x="13" y="1" width="10" height="10" fill="#7fba00"/>' +
      '<rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>' +
      '<rect x="13" y="13" width="10" height="10" fill="#ffb900"/>'
    )
  }
  void viewBox
  return `<path d="${path}" fill="${color}"/>`
}

/**
 * A complete, self-contained branded SVG for a partner author. 16:9 viewBox
 * that fills its container (slice), matching `categoryThumbnailSvg`. Returns an
 * empty string when the author isn't a known partner — callers should fall back
 * to category art in that case (see `hasPartnerArt`).
 */
export function partnerThumbnailSvg(author: string | undefined, category?: string): string {
  const partner = getPartner(author)
  if (!partner) return ''

  const { color, tint, mark, label: brand } = partner
  const catKey = isCategoryArtKey(category) ? category : 'mixed'
  const catLabel = CATEGORY_ART[catKey].label.toUpperCase()

  // Hero geometry: logo centered slightly high, leaving room for the label.
  const cx = 160
  const cy = 74
  const logoSize = 58
  const half = logoSize / 2
  const logo = logoMarkup(author!, mark.viewBox, mark.path, color)

  const uid = `p${hashSeed(`${author}${catKey}`).toString(36)}`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${brand} — ${CATEGORY_ART[catKey].label} pack">
  <defs>
    <radialGradient id="pbg-${uid}" cx="50%" cy="-4%" r="120%">
      <stop offset="0%" stop-color="${tint}"/>
      <stop offset="80%" stop-color="${VOID}"/>
    </radialGradient>
    <radialGradient id="pglow-${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="${color}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="pdot-${uid}" width="13" height="13" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${color}" opacity="0.05"/>
    </pattern>
    <linearGradient id="pscrim-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="52%" stop-color="${VOID}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${VOID}" stop-opacity="0.62"/>
    </linearGradient>
  </defs>

  <rect width="320" height="180" fill="url(#pbg-${uid})"/>
  <rect width="320" height="180" fill="url(#pdot-${uid})"/>

  <!-- pulsing brand glow behind the mark -->
  <ellipse cx="${cx}" cy="${cy}" rx="78" ry="56" fill="url(#pglow-${uid})">
    <animate attributeName="opacity" values="0.6;1;0.6" dur="5.5s" repeatCount="indefinite"/>
  </ellipse>

  <!-- counter-rotating orbit rings -->
  <g fill="none" stroke="${color}" stroke-linecap="round">
    <circle cx="${cx}" cy="${cy}" r="46" stroke-width="1" stroke-opacity="0.26" stroke-dasharray="3 7">
      <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="28s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${cx}" cy="${cy}" r="60" stroke-width="1" stroke-opacity="0.13" stroke-dasharray="1 9">
      <animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="44s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- hero brand mark -->
  <svg x="${cx - half}" y="${cy - half}" width="${logoSize}" height="${logoSize}" viewBox="${mark.viewBox}">${logo}</svg>

  <rect width="320" height="180" fill="url(#pscrim-${uid})"/>
  <text x="160" y="138" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="3" fill="${color}" opacity="0.78">${catLabel}</text>
</svg>`
}
