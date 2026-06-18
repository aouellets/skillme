/**
 * Canonical provenance rules for catalog skills.
 *
 * Every skill should resolve to a `source_url` so nothing in the catalog is an
 * unverifiable orphan:
 *  - A skill that already declares a `source_url` keeps it (real external repos
 *    like anthropics/skills or the Skill Me–authored skills, which point at
 *    `skills/<slug>`).
 *  - A `community`- or `Skill Me`-authored skill with no URL is hosted in this
 *    repo at `skills/<slug>`, so its canonical copy is inspectable.
 *  - A skill attributed to a named external author but with no URL is left
 *    without one — we don't fabricate provenance for someone else's work.
 *
 * Shared by the live seeder (`scripts/seed-manual.ts`), the offline fallback
 * renderer (`lib/data.ts`), and the SKILL.md exporter
 * (`scripts/export-skill-files.ts`) so all three agree.
 */
export const SKILLS_REPO = 'https://github.com/aouellets/skillme'

/** Authors whose unsourced skills we host (and may publish) in this repo. */
const HOSTED_AUTHORS = new Set(['community', 'Skill Me'])

/** The repo URL for a skill we host at `skills/<slug>`. */
export function hostedSourceUrl(slug: string): string {
  return `${SKILLS_REPO}/tree/main/skills/${slug}`
}

/** Resolve the source_url for a seed skill, applying the rules above. */
export function resolveSourceUrl(skill: {
  slug: string
  author: string
  source_url?: string
}): string | undefined {
  if (skill.source_url) return skill.source_url
  if (HOSTED_AUTHORS.has(skill.author)) return hostedSourceUrl(skill.slug)
  return undefined
}

/** True when this repo hosts the canonical SKILL.md for the skill. */
export function isHostedHere(skill: {
  slug: string
  author: string
  source_url?: string
}): boolean {
  return resolveSourceUrl(skill) === hostedSourceUrl(skill.slug)
}
