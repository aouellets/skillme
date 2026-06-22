import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ReactElement } from 'react'
import type { SkillCategory } from '@/lib/types'

/**
 * Shared brand kit for dynamically generated Open Graph / share images
 * (next/og + Satori). One place for the palette, the canvas size, the fonts,
 * and the Skill Me logo mark so every card (home, skill, pack) is consistent.
 *
 * Both faces are vendored as binaries co-located in ./fonts and traced into the
 * function bundle — Inter (the brand face, used for everything) and Geist (kept
 * as a defensive fallback family). Nothing is fetched at render time, so a card
 * NEVER renders in the wrong font or fails because a remote font host is down.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG = {
  // Dark card surfaces (skill / pack detail cards stay on the dark shell)
  void: '#080a0a',
  surface: '#13110f',
  surfaceRaised: '#1a1714',
  border: '#262220',
  text: '#f5f7f5',
  secondary: '#9ba29d',
  tertiary: '#646b66',
  // Brand tokens
  ink: '#1c1a17',
  inkMuted: '#6b635a',
  paper: '#faf6f0',
  accent: '#ee4628', // vermilion
  accentDeep: '#c23a20',
  accentDim: '#7a2616',
  // Back-compat aliases (older call sites referenced `gold` / `onGold`)
  gold: '#ee4628',
  onGold: '#faf6f0',
}

/** Per-category accent (hex mirror of the --cat-* CSS vars, which Satori can't
 *  resolve). Lets each skill card carry a quiet signal of its category. */
export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  writing: '#a797ff',
  coding: '#4fd1d9',
  research: '#6ee787',
  productivity: '#f5c451',
  data: '#5b9df9',
  design: '#ff8a5c',
  business: '#df8ad9',
  personal: '#aab4a4',
}

type FontWeight = 400 | 600 | 700 | 800
type FontEntry = { name: string; data: Buffer | ArrayBuffer; weight: FontWeight; style: 'normal' }

let fontCache: FontEntry[] | null = null

// Read the vendored fonts from the project tree via process.cwd() rather than a
// `new URL(..., import.meta.url)` asset reference: webpack rewrites the latter
// into an asset URL that breaks `fileURLToPath` under production minification
// (ERR_INVALID_ARG_TYPE), and nft drops a templated path (ENOENT on Vercel).
// `next.config.ts` outputFileTracingIncludes guarantees these files ship in the
// OG function bundles at this project-relative location.
export async function loadBrandFonts(): Promise<FontEntry[]> {
  if (fontCache) return fontCache
  const dir = path.join(process.cwd(), 'lib', 'og', 'fonts')
  const readFont = (file: string) => readFile(path.join(dir, file))
  const [i400, i600, i700, i800, gRegular, gSemibold] = await Promise.all([
    readFont('Inter-400.woff'),
    readFont('Inter-600.woff'),
    readFont('Inter-700.woff'),
    readFont('Inter-800.woff'),
    readFont('Geist-Regular.ttf'),
    readFont('Geist-SemiBold.ttf'),
  ])
  fontCache = [
    { name: 'Inter', data: i400, weight: 400, style: 'normal' },
    { name: 'Inter', data: i600, weight: 600, style: 'normal' },
    { name: 'Inter', data: i700, weight: 700, style: 'normal' },
    { name: 'Inter', data: i800, weight: 800, style: 'normal' },
    // Defensive fallback family; not referenced by the cards directly.
    { name: 'Geist', data: gRegular, weight: 400, style: 'normal' },
    { name: 'Geist', data: gSemibold, weight: 600, style: 'normal' },
  ]
  return fontCache
}

/** Skill Me logo mark: the rounded tile + three bars (the wider middle bar in
 *  the vermilion accent). Composed from divs so it's robust under Satori.
 *  Defaults suit a dark card (paper tile, ink bars); pass tile/bar to invert. */
export function LogoBadge({
  size = 64,
  tile = OG.paper,
  bar = OG.ink,
}: {
  size?: number
  tile?: string
  bar?: string
}): ReactElement {
  const barStyle = (wFrac: number, color: string) => ({
    width: Math.round(wFrac * size),
    height: Math.round(0.12 * size),
    borderRadius: Math.round(0.06 * size),
    backgroundColor: color,
  })
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(0.25 * size),
        backgroundColor: tile,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: Math.round(0.24 * size),
        gap: Math.round(0.06 * size),
      }}
    >
      <div style={barStyle(0.407, bar)} />
      <div style={barStyle(0.519, OG.accent)} />
      <div style={barStyle(0.315, bar)} />
    </div>
  )
}

/** Brand wordmark: lowercase "skillme" in Inter 700, "me" in vermilion.
 *  Default color suits dark cards; pass `color` for light surfaces. */
export function Wordmark({ size = 30, color = OG.text }: { size?: number; color?: string }): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: 'Inter',
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -size * 0.03,
        color,
      }}
    >
      skill<span style={{ color: OG.accent }}>me</span>
    </div>
  )
}

/** The brand mark + wordmark, locked up. The lockup every card opens with. */
export function Lockup({ mark = 56, word = 30 }: { mark?: number; word?: number }): ReactElement {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <LogoBadge size={mark} />
      <Wordmark size={word} />
    </div>
  )
}

/** Vermilion star glyph as SVG (kept as SVG so it renders identically across
 *  fonts). Used on the skill card to show an average rating. */
export function Star({ size = 28, color = OG.accent }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.2l2.95 6.3 6.85.62-5.18 4.6 1.55 6.68L12 17.3l-6.12 3.7 1.55-6.68L2.25 9.72l6.85-.62z" />
    </svg>
  )
}

/** Small check glyph for the verified signal. */
export function Check({ size = 24, color = OG.accent }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

/** A capability / metadata pill. `tone` picks the accent treatment. */
export function Pill({
  children,
  dot,
  tone = 'neutral',
}: {
  children: string
  dot?: string
  tone?: 'neutral' | 'accent'
}): ReactElement {
  const accent = tone === 'accent'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: `1px solid ${accent ? OG.accentDim : OG.border}`,
        backgroundColor: accent ? 'rgba(238,70,40,0.10)' : OG.surface,
        color: accent ? OG.accent : OG.secondary,
        borderRadius: 999,
        padding: '11px 24px',
        fontSize: 26,
        fontWeight: 600,
      }}
    >
      {dot && <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: dot }} />}
      {children}
    </div>
  )
}

/** A skill-name chip for the pack card's contents list. */
export function SkillChip({ children, muted = false }: { children: string; muted?: boolean }): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: `1px solid ${OG.border}`,
        backgroundColor: OG.surfaceRaised,
        borderRadius: 14,
        padding: '12px 20px',
        fontSize: 26,
        fontWeight: 600,
        color: muted ? OG.tertiary : OG.text,
      }}
    >
      {!muted && <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: OG.accent }} />}
      {children}
    </div>
  )
}

/** Normalize text for share cards: strip em/en dashes (brand rule) and collapse
 *  whitespace. */
export function clean(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Clean, then truncate on a WORD boundary (never mid-word) with an ellipsis. */
export function truncateWords(text: string, max: number): string {
  const t = clean(text)
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:]+$/, '')}…`
}

/** Scale a headline so long names still fit two lines. */
export function headlineSize(name: string): number {
  return name.length > 34 ? 62 : name.length > 22 ? 78 : 94
}

/**
 * Greedily pick which skill names fit within `maxRows` rows of `rowWidth`,
 * reserving room for a trailing "+N more" chip when not everything fits. Uses a
 * pure width estimate (no measuring) so the pack card's footer can never get
 * pushed off the 630px canvas. Returns the names to render as chips; the caller
 * derives the remainder from the pack's true skill count.
 */
export function fitSkillChips(
  names: string[],
  total: number,
  rowWidth = 1048,
  maxRows = 2,
): string[] {
  const GAP = 14
  const MORE = 168 // width budget held back for the "+N more" pill
  const est = (s: string) => Math.ceil(s.length * 14.6) + 102 // dot + gaps + padding + border
  const pack = (reserve: number): string[] => {
    const rows: string[][] = [[]]
    for (const n of names) {
      const row = rows[rows.length - 1]
      const used = row.reduce((a, x) => a + est(x) + GAP, 0)
      const budget = rowWidth - (rows.length === maxRows ? reserve : 0)
      if (used + est(n) <= budget) row.push(n)
      else if (rows.length < maxRows) rows.push([n])
      else break
    }
    return rows.flat()
  }
  const all = pack(0)
  // If something will be left over, repack holding back room for the more-pill.
  return all.length < total ? pack(MORE) : all
}

/** A short, app-icon-style monogram for a skill name: initials of the first two
 *  words, else the two leading capitals (CodeGraph → CG), else the first two
 *  letters. Always upper-cased. */
export function monogram(name: string): string {
  const words = clean(name).split(' ').filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  const w = words[0] ?? '?'
  const caps = w.match(/[A-Z]/g)
  if (caps && caps.length >= 2) return (caps[0] + caps[1]).toUpperCase()
  return w.slice(0, 2).toUpperCase()
}

/** Pick ink or paper for legible text on a solid color tile (luminance test). */
export function readableOn(hex: string): string {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return L > 0.62 ? OG.ink : OG.paper
}
