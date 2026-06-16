const DEFAULT_SITE_URL = 'https://skillshelf.io'
const DEFAULT_MCP_URL = 'https://api.skillshelf.io/mcp'

/**
 * Resolve the public site URL defensively. A missing, empty, or bare-host value
 * (e.g. "skillshelf.io") would otherwise throw `new URL(...)` during the build's
 * page-data collection and fail the deploy. Coerce a bare host to https and fall
 * back to the default if it still isn't a valid absolute URL.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return DEFAULT_SITE_URL
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(candidate).toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = resolveSiteUrl()

export const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL?.trim() || DEFAULT_MCP_URL
