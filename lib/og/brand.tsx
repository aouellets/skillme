import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ReactElement } from 'react'

/**
 * Shared brand kit for dynamically generated Open Graph / share images
 * (next/og + Satori). One place for the palette, the canvas size, the fonts,
 * and the Skill Me logo mark so every card (home, skill, pack) is consistent.
 *
 * Geist is vendored as .ttf (co-located, traced into the function). Inter — the
 * brand face for the wordmark — is fetched at render from Google Fonts; if that
 * fetch fails for any reason, the loader falls back to Geist registered under
 * the name "Inter" so an image NEVER fails to render.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG = {
  // Dark card surfaces (skill / pack detail cards stay on the dark shell)
  void: '#080a0a',
  surface: '#101413',
  border: '#222826',
  text: '#f5f7f5',
  secondary: '#9ba29d',
  tertiary: '#646b66',
  // Brand tokens
  ink: '#1c1a17',
  inkMuted: '#6b635a',
  paper: '#faf6f0',
  accent: '#ee4628', // vermilion
  accentDeep: '#c23a20',
  // Back-compat aliases (older call sites referenced `gold` / `onGold`)
  gold: '#ee4628',
  onGold: '#faf6f0',
}

type FontEntry = { name: string; data: Buffer | ArrayBuffer; weight: 400 | 600 | 700 | 900; style: 'normal' }

let fontCache: FontEntry[] | null = null

/** Fetch a static Inter weight from Google Fonts as a Satori-parseable binary.
 *  An old User-Agent makes Google serve TTF (not woff2, which Satori can't read). */
async function fetchInter(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
      },
    }).then((r) => r.text())
    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1]
    if (!url) return null
    return await fetch(url).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export async function loadBrandFonts(): Promise<FontEntry[]> {
  if (fontCache) return fontCache
  const read = (file: string) => readFile(fileURLToPath(new URL(`./fonts/${file}`, import.meta.url)))
  const [regular, semibold, black, inter400, inter700] = await Promise.all([
    read('Geist-Regular.ttf'),
    read('Geist-SemiBold.ttf'),
    read('Geist-Black.ttf'),
    fetchInter(400),
    fetchInter(700),
  ])
  fontCache = [
    { name: 'Geist', data: regular, weight: 400, style: 'normal' },
    { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
    { name: 'Geist', data: black, weight: 900, style: 'normal' },
    // Inter — fall back to Geist data under the "Inter" family if the fetch failed.
    { name: 'Inter', data: inter400 ?? regular, weight: 400, style: 'normal' },
    { name: 'Inter', data: inter700 ?? black, weight: 700, style: 'normal' },
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

/** Vermilion star glyph as SVG (Geist has no ★ glyph, so we draw it). */
export function Star({ size = 28 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={OG.accent}>
      <path d="M12 2.2l2.95 6.3 6.85.62-5.18 4.6 1.55 6.68L12 17.3l-6.12 3.7 1.55-6.68L2.25 9.72l6.85-.62z" />
    </svg>
  )
}

/** Normalize text for share cards: strip em/en dashes (brand rule) and trim. */
export function clean(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** A small bordered pill for stat / capability chips. */
export function Chip({ children }: { children: string }): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${OG.border}`,
        backgroundColor: OG.surface,
        color: OG.secondary,
        borderRadius: 999,
        padding: '10px 22px',
        fontSize: 26,
      }}
    >
      {children}
    </div>
  )
}
