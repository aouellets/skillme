/**
 * Known-partner registry. Maps a skill/pack `author` to an official brand so
 * the UI can show that company's logo as a trust signal ("skills authored by
 * <company>"). Brand marks live in `partner-logos.ts` (simple-icons, CC0).
 *
 * Only well-known organizations whose skills we host belong here — matched on
 * the exact `author` string used in the catalog. Adding a new partner is just
 * a new entry (and, if needed, a mark in partner-logos.ts).
 */
import { BRAND_MARKS, type BrandMark } from './partner-logos'

export interface Partner {
  /** Display name (usually identical to the catalog author). */
  label: string
  /** Brand mark key in BRAND_MARKS. */
  logo: string
  /** Official site / org URL the logo links to. */
  url: string
  /** Brand accent color — drives the glow/rings/label in branded pack art. */
  color: string
  /** Dark brand tint for the top of the radial backdrop in branded art. */
  tint: string
}

/** Keyed by the exact catalog `author` string. */
const PARTNERS: Record<string, Partner> = {
  Anthropic: { label: 'Anthropic', logo: 'anthropic', url: 'https://github.com/anthropics/skills', color: '#d97757', tint: '#2a1712' },
  'Hugging Face': { label: 'Hugging Face', logo: 'huggingface', url: 'https://github.com/huggingface/skills', color: '#ffd21e', tint: '#241f08' },
  Google: { label: 'Google', logo: 'google', url: 'https://github.com/googleworkspace/cli', color: '#4285f4', tint: '#0d1b33' },
  Vercel: { label: 'Vercel', logo: 'vercel', url: 'https://github.com/vercel-labs/agent-skills', color: '#f5f7f5', tint: '#16181c' },
  Microsoft: { label: 'Microsoft', logo: 'microsoft', url: 'https://github.com/microsoft/skills', color: '#00a4ef', tint: '#0c1626' },
  WordPress: { label: 'WordPress', logo: 'wordpress', url: 'https://github.com/WordPress/agent-skills', color: '#2ea8e0', tint: '#0b1f2a' },
  Meta: { label: 'Meta', logo: 'meta', url: 'https://github.com/facebookresearch', color: '#0866ff', tint: '#0a1530' },
}

export interface ResolvedPartner extends Partner {
  mark: BrandMark
}

/** Return partner branding for an author, or null if not a known partner. */
export function getPartner(author?: string | null): ResolvedPartner | null {
  if (!author) return null
  const p = PARTNERS[author]
  if (!p) return null
  const mark = BRAND_MARKS[p.logo]
  if (!mark) return null
  return { ...p, mark }
}

/** True when the author is a recognized partner brand. */
export function isPartner(author?: string | null): boolean {
  return getPartner(author) !== null
}

/**
 * Ordered partner list for the landing-page trust strip. Each links to that
 * partner's official pack on the catalog. Author must match a PARTNERS key.
 */
export const PARTNER_STRIP: { author: string; packSlug: string }[] = [
  { author: 'Anthropic', packSlug: 'anthropic-official-skills' },
  { author: 'Google', packSlug: 'google-workspace-skills' },
  { author: 'Vercel', packSlug: 'vercel-agent-skills' },
  { author: 'Microsoft', packSlug: 'azure-sdk-skills-python' },
  { author: 'Hugging Face', packSlug: 'hugging-face-ml-toolkit' },
  { author: 'WordPress', packSlug: 'wordpress-agent-skills' },
]
