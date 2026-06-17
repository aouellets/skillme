import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ReactElement } from 'react'

/**
 * Shared brand kit for dynamically generated Open Graph / share images
 * (next/og + Satori). One place for the palette, the canvas size, the
 * self-hosted Geist fonts, and the SkillShelf logo mark so every card
 * (home, skill, pack) is visually consistent.
 *
 * Fonts are loaded from co-located .ttf files via `import.meta.url` so Next
 * traces and bundles them into the serverless function (works on the Node
 * runtime these routes use). Satori does not accept woff2, hence ttf.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG = {
  void: '#0a0a0c',
  surface: '#121216',
  border: '#25252d',
  text: '#fafafa',
  secondary: '#a2a2ad',
  tertiary: '#6c6c79',
  gold: '#f0b429',
  onGold: '#1a1305',
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

/** SkillShelf logo mark, composed from divs (the stacked-shelf monogram). */
export function LogoBadge({ size = 64 }: { size?: number }): ReactElement {
  const unit = size / 64
  const bar = (w: number, color: string) => ({
    width: w * unit,
    height: 9 * unit,
    borderRadius: 4 * unit,
    backgroundColor: color,
  })
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 14 * unit,
        backgroundColor: OG.surface,
        border: `${2 * unit}px solid #34343f`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4.5 * unit,
        padding: `0 ${14 * unit}px`,
      }}
    >
      <div style={bar(36, OG.gold)} />
      <div style={bar(22, OG.secondary)} />
      <div style={bar(36, OG.gold)} />
    </div>
  )
}

/** Brand wordmark used in card headers/footers. */
export function Wordmark({ size = 30 }: { size?: number }): ReactElement {
  return (
    <div style={{ display: 'flex', fontSize: size, fontWeight: 600, color: OG.text }}>
      Skill<span style={{ color: OG.gold }}>Shelf</span>
    </div>
  )
}

/** Gold star glyph as SVG (Geist has no ★ glyph, so we draw it). */
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
