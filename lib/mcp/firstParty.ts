/**
 * First-party install nudge helpers.
 *
 * "Internally authored" skills carry `author === 'Skill Me'` (the same signal
 * lib/partners.ts uses to tell originals from third-party/partner skills). When
 * an anonymous connector identity installs one, the install still succeeds
 * (soft gate) — we just nudge the caller to sign in so their library persists
 * and stays synced with the website. Account-bound identities (`auth:<id>`)
 * already get that for free, so they never see the nudge.
 */

/** Author string that marks a Skill Me original vs a third-party/partner skill. */
export const FIRST_PARTY_AUTHOR = 'Skill Me'

export function isFirstParty(author: string | null | undefined): boolean {
  return author === FIRST_PARTY_AUTHOR
}

/**
 * True when the token is a signed-in Skill Me account (`auth:<id>`) rather than
 * an anonymous connection (`mcp_<uuid>` or a legacy client-chosen header).
 * Mirrors the prefix check in lib/mcp/mergeAnonLibrary.ts.
 */
export function isAccountToken(token: string): boolean {
  return token.startsWith('auth:')
}

/**
 * Nudge appended to a successful install when an anonymous caller installs one
 * or more Skill Me originals. `names` is the first-party skills involved;
 * returns '' for none so callers can append unconditionally.
 */
export function firstPartyNudge(names: string[]): string {
  if (names.length === 0) return ''
  const isOne = names.length === 1
  const subject = isOne
    ? `"${names[0]}" is a Skill Me original`
    : `${names.length} of these are Skill Me originals (${names.join(', ')})`
  return (
    `\n\n---\n\n${subject}. You're connected anonymously, so this library ` +
    `won't carry over if you reconnect. Sign in to keep ${isOne ? 'it' : 'them'} ` +
    `synced across the website and Claude — reconnect the Skill Me connector and ` +
    `choose "Sign in to sync my skills".`
  )
}
