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
}

/** Keyed by the exact catalog `author` string. */
const PARTNERS: Record<string, Partner> = {
  Anthropic: { label: 'Anthropic', logo: 'anthropic', url: 'https://github.com/anthropics/skills' },
  'Hugging Face': { label: 'Hugging Face', logo: 'huggingface', url: 'https://github.com/huggingface/skills' },
  Google: { label: 'Google', logo: 'google', url: 'https://github.com/googleworkspace/cli' },
  Vercel: { label: 'Vercel', logo: 'vercel', url: 'https://github.com/vercel-labs/agent-skills' },
  Microsoft: { label: 'Microsoft', logo: 'microsoft', url: 'https://github.com/microsoft/skills' },
  WordPress: { label: 'WordPress', logo: 'wordpress', url: 'https://github.com/WordPress/agent-skills' },
  Meta: { label: 'Meta', logo: 'meta', url: 'https://github.com/facebookresearch' },
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
