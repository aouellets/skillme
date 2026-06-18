/**
 * Per-category placeholder art. Single source of truth for both the runtime
 * thumbnail fallback (`components/SkillThumbnail.tsx`) and the static SVG files
 * emitted to `public/category/<key>[-n].svg`
 * (`scripts/generate-category-art.ts`).
 *
 * Each category gets its brand color (mirrors the `--cat-*` tokens), a dark
 * tint for the radial backdrop, a label, and SEVERAL stroked line icons. A
 * stable per-skill seed picks one variant so cards in the same category don't
 * all look identical, while staying deterministic across server/client renders.
 */
export type CategoryArtKey =
  | 'coding' | 'writing' | 'research' | 'productivity'
  | 'data' | 'design' | 'business' | 'personal' | 'mixed'

export interface CategoryArt {
  /** Foreground brand color (matches --cat-* tokens). */
  fg: string
  /** Dark tint for the top of the radial backdrop. */
  bg: string
  /** Display label rendered under the icon. */
  label: string
  /** Icon variants, each inner SVG markup drawn in a 0 0 24 24 box, stroked. */
  icons: string[]
}

export const CATEGORY_ART: Record<CategoryArtKey, CategoryArt> = {
  coding: {
    fg: '#4fd1d9', bg: '#0e1f21', label: 'Coding',
    icons: [
      '<path d="M10 8 6 12l4 4"/><path d="M14 8l4 4-4 4"/><path d="M13 7l-2 10"/>',
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2.5-3 2.5"/><path d="M12.5 15.5H16"/>',
      '<circle cx="7" cy="7" r="2.2"/><circle cx="7" cy="17" r="2.2"/><circle cx="16" cy="7" r="2.2"/><path d="M7 9.2v5.6"/><path d="M16 9.2c0 4.8-4 4-9 5.5"/>',
    ],
  },
  writing: {
    fg: '#a797ff', bg: '#191428', label: 'Writing',
    icons: [
      '<path d="M15.5 4.5l4 4L9 19l-4.5 1L6 15.5z"/><path d="M13.5 6.5l4 4"/>',
      '<rect x="6" y="4" width="12" height="16" rx="1.5"/><path d="M9 9h6"/><path d="M9 12h6"/><path d="M9 15h4"/>',
      '<path d="M5 6h14v10h-7l-4 3v-3H5z"/><path d="M8 10h8"/><path d="M8 13h5"/>',
    ],
  },
  research: {
    fg: '#6ee787', bg: '#0f2117', label: 'Research',
    icons: [
      '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 20 20"/>',
      '<path d="M12 7v12"/><path d="M12 7C10 5.5 6 5.5 4 6.5v11c2-1 6-1 8 .5"/><path d="M12 7c2-1.5 6-1.5 8-.5v11c-2-1-6-1-8 .5"/>',
      '<path d="M9 4h6"/><path d="M10 4v5L6 17.5A1.5 1.5 0 0 0 7.4 20h9.2a1.5 1.5 0 0 0 1.4-2.5L14 9V4"/><path d="M8.5 14h7"/>',
    ],
  },
  productivity: {
    fg: '#f5c451', bg: '#1f1a0c', label: 'Productivity',
    icons: [
      '<circle cx="12" cy="12" r="8"/><path d="M8.5 12.5 11 15l4.5-5.5"/>',
      '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
      '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8.5 14l1.5 1.5 3.5-3.5"/>',
    ],
  },
  data: {
    fg: '#5b9df9', bg: '#0f1d33', label: 'Data',
    icons: [
      '<path d="M5 19h14"/><rect x="6" y="11" width="3" height="6" rx="0.5"/><rect x="11" y="7" width="3" height="10" rx="0.5"/><rect x="16" y="4" width="3" height="13" rx="0.5"/>',
      '<path d="M4 17 9.5 11l3.5 3 6.5-8"/><path d="M16 6h4v4"/>',
      '<circle cx="12" cy="12" r="8"/><path d="M12 4v8h8"/>',
    ],
  },
  design: {
    fg: '#ff8a5c', bg: '#26140c', label: 'Design',
    icons: [
      '<path d="M12 4 20 18H4z"/><circle cx="12" cy="13" r="2.5"/>',
      '<path d="M6 18 18 6"/><rect x="3.5" y="15.5" width="5" height="5" rx="1"/><rect x="15.5" y="3.5" width="5" height="5" rx="1"/>',
      '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="15" cy="14" r="1.2"/><circle cx="10" cy="15" r="1.2"/>',
    ],
  },
  business: {
    fg: '#df8ad9', bg: '#221024', label: 'Business',
    icons: [
      '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M4 13h16"/>',
      '<path d="M5 20V7l7-3 7 3v13"/><path d="M3 20h18"/><path d="M9 9h2.5"/><path d="M12.5 9H15"/><path d="M9 13h2.5"/><path d="M12.5 13H15"/><path d="M10.5 20v-4h3v4"/>',
      '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/>',
    ],
  },
  personal: {
    fg: '#aab4a4', bg: '#16180f', label: 'Personal',
    icons: [
      '<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
      '<path d="M12 20S5 15.5 5 10.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"/>',
      '<path d="M4 11 12 4l8 7"/><path d="M6 9.5V19h12V9.5"/><path d="M10 19v-5h4v5"/>',
    ],
  },
  mixed: {
    fg: '#b4f33e', bg: '#16210b', label: 'Collection',
    icons: [
      '<path d="M12 3.5 14 9.5 20 12 14 14.5 12 20.5 10 14.5 4 12 10 9.5z"/><path d="M19 4.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
      '<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>',
      '<path d="M12 4 3 9l9 5 9-5z"/><path d="M3 14l9 5 9-5"/>',
    ],
  },
}

const VOID = '#080a0a'

/** True if a string is a category we have art for. */
export function isCategoryArtKey(value: string | undefined): value is CategoryArtKey {
  return value != null && value in CATEGORY_ART
}

/** Stable FNV-1a hash → non-negative int. Deterministic across server/client. */
function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface CategoryArtOptions {
  /** A stable per-skill string (its name) used to pick an icon variant. */
  seed?: string
  /** Force a specific variant index (used by the static file generator). */
  variant?: number
}

/** Number of icon variants available for a category. */
export function categoryVariantCount(category: string): number {
  const key: CategoryArtKey = isCategoryArtKey(category) ? category : 'mixed'
  return CATEGORY_ART[key].icons.length
}

/**
 * A complete, self-contained SVG placeholder for a category. 16:9 viewBox that
 * fills its container (slice), so it works for both card and detail aspects.
 * The icon variant is chosen from `variant` if given, else deterministically
 * from `seed`, else the first. Gradient/pattern ids are unique per instance so
 * many cards can render on one page without id collisions.
 */
export function categoryThumbnailSvg(category: string | undefined, opts: CategoryArtOptions = {}): string {
  const key: CategoryArtKey = isCategoryArtKey(category) ? category : 'mixed'
  const art = CATEGORY_ART[key]
  const count = art.icons.length
  const seedHash = opts.seed ? hashSeed(opts.seed) : 0
  const variant =
    opts.variant != null
      ? ((opts.variant % count) + count) % count
      : seedHash % count
  const icon = art.icons[variant]
  const uid = `${key}${variant}${opts.seed ? seedHash.toString(36) : ''}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${art.label} placeholder">
  <defs>
    <radialGradient id="cg-${uid}" cx="50%" cy="-6%" r="115%">
      <stop offset="0%" stop-color="${art.bg}"/>
      <stop offset="78%" stop-color="${VOID}"/>
    </radialGradient>
    <pattern id="cd-${uid}" width="13" height="13" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${art.fg}" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="320" height="180" fill="url(#cg-${uid})"/>
  <rect width="320" height="180" fill="url(#cd-${uid})"/>
  <g transform="translate(136 50) scale(2)" fill="none" stroke="${art.fg}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">${icon}</g>
  <text x="160" y="134" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="3" fill="${art.fg}" opacity="0.7">${art.label.toUpperCase()}</text>
</svg>`
}
