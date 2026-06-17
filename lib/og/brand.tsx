import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ReactElement } from 'react'

/**
 * Shared brand kit for dynamically generated Open Graph / share images
 * (next/og + Satori). One place for the palette, the canvas size, the
 * self-hosted Geist fonts, and the Skill Me logo mark so every card
 * (home, skill, pack) is visually consistent.
 *
 * Fonts are loaded from co-located .ttf files via `import.meta.url` so Next
 * traces and bundles them into the serverless function (works on the Node
 * runtime these routes use). Satori does not accept woff2, hence ttf.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG = {
  void: '#080a0a',
  surface: '#101413',
  border: '#222826',
  text: '#f5f7f5',
  secondary: '#9ba29d',
  tertiary: '#646b66',
  // The locked lime accent. Key name kept for call-site stability.
  gold: '#b4f33e',
  onGold: '#0a1400',
}

let fontCache: Array<{ name: string; data: Buffer; weight: 400 | 600 | 900; style: 'normal' }> | null =
  null

export async function loadBrandFonts() {
  if (fontCache) return fontCache
  const read = (file: string) => readFile(fileURLToPath(new URL(`./fonts/${file}`, import.meta.url)))
  const [regular, semibold, black] = await Promise.all([
    read('Geist-Regular.ttf'),
    read('Geist-SemiBold.ttf'),
    read('Geist-Black.ttf'),
  ])
  fontCache = [
    { name: 'Geist', data: regular, weight: 400, style: 'normal' },
    { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
    { name: 'Geist', data: black, weight: 900, style: 'normal' },
  ]
  return fontCache
}

/** Skill Me logo mark, composed from divs: a rising bar chart in the lime
 *  accent (the "personal momentum" motif), robust under Satori. */
export function LogoBadge({ size = 64 }: { size?: number }): ReactElement {
  const unit = size / 64
  const bar = (h: number, color: string) => ({
    width: 7 * unit,
    height: h * unit,
    borderRadius: 3 * unit,
    backgroundColor: color,
  })
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16 * unit,
        backgroundColor: OG.surface,
        border: `${2 * unit}px solid #323a37`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 4 * unit,
        padding: `0 0 ${16 * unit}px`,
      }}
    >
      <div style={bar(14, OG.secondary)} />
      <div style={bar(22, OG.gold)} />
      <div style={bar(32, OG.gold)} />
    </div>
  )
}

/** Brand wordmark used in card headers/footers. */
export function Wordmark({ size = 30 }: { size?: number }): ReactElement {
  return (
    <div style={{ display: 'flex', fontSize: size, fontWeight: 600, color: OG.text }}>
      Skill<span style={{ color: OG.gold }}>&nbsp;Me</span>
    </div>
  )
}

/** Lime star glyph as SVG (Geist has no ★ glyph, so we draw it). */
export function Star({ size = 28 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={OG.gold}>
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
