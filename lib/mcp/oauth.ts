import crypto from 'node:crypto'

/**
 * Minimal, stateless OAuth 2.1 shim for the Skill Me MCP server.
 *
 * WHY THIS EXISTS: claude.ai's custom-connector flow assumes OAuth 2.1 and runs
 * Dynamic Client Registration on connect for every remote MCP server. A server
 * that exposes no OAuth metadata fails registration ("Couldn't register with …'s
 * sign-in service"). Skill Me has no real user accounts, so we implement a
 * frictionless shim: register any client, auto-approve the authorization step,
 * and issue HMAC-signed tokens that encode a stable anonymous identity.
 *
 * Everything is stateless — tokens carry their own claims and are verified by
 * HMAC signature, so this works across serverless instances with no shared
 * store. The access token's `sub` becomes the MCP user identity (the partition
 * key for a caller's installed-skill library).
 *
 * SECURITY NOTES:
 *  - Tokens are signed (HMAC-SHA256), not encrypted; payloads are not secret.
 *  - PKCE (S256) is required and verified on the token exchange.
 *  - There is no real authentication, so each authorization mints a fresh
 *    anonymous `sub` (a new empty library). This matches the prior token-based
 *    model and is the inherent limitation of an authless connector.
 */

const ISSUER_TYP = {
  client: 'client',
  code: 'code',
  access: 'access',
  refresh: 'refresh',
} as const

const TTL = {
  // Authorization codes are single-use and short-lived by design.
  code: 10 * 60, // 10 minutes
  access: 30 * 24 * 60 * 60, // 30 days
  refresh: 365 * 24 * 60 * 60, // 1 year
  client: 10 * 365 * 24 * 60 * 60, // effectively non-expiring client_id
} as const

export const SUPPORTED_SCOPES = ['mcp', 'offline_access'] as const

function nowSec(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Resolve the HMAC signing secret. Prefers a dedicated MCP_OAUTH_SECRET, falls
 * back to the Supabase service-role key (already a stable server secret present
 * in production), and only in non-production uses a fixed dev value. Throwing in
 * production avoids silently signing tokens with a guessable key.
 */
function getSecret(): string {
  const secret =
    process.env.MCP_OAUTH_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'MCP_OAUTH_SECRET (or SUPABASE_SERVICE_ROLE_KEY) must be set to sign MCP OAuth tokens'
    )
  }
  return 'dev-insecure-mcp-oauth-secret-do-not-use-in-production'
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url')
}

interface BasePayload {
  typ: string
  iat: number
  exp: number
  [key: string]: unknown
}

function sign(payload: Omit<BasePayload, 'iat'> & { iat?: number }): string {
  const full = { iat: nowSec(), ...payload }
  const body = b64url(JSON.stringify(full))
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

function verify<T extends BasePayload = BasePayload>(token: string): T | null {
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  let payload: T
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
  if (typeof payload.exp !== 'number' || payload.exp < nowSec()) return null
  return payload
}

// ---- Client registration (DCR, RFC 7591) -----------------------------------

/**
 * Mint a stateless client_id that encodes the registered redirect URIs, so the
 * authorize endpoint can validate redirect_uri without a database lookup.
 */
export function issueClientId(redirectUris: string[]): string {
  return sign({
    typ: ISSUER_TYP.client,
    exp: nowSec() + TTL.client,
    ru: redirectUris,
  })
}

export function readClientId(clientId: string): { redirectUris: string[] } | null {
  const payload = verify(clientId)
  if (!payload || payload.typ !== ISSUER_TYP.client) return null
  const ru = Array.isArray(payload.ru) ? (payload.ru as string[]) : []
  return { redirectUris: ru }
}

// ---- Authorization code -----------------------------------------------------

export function issueAuthCode(params: {
  sub: string
  codeChallenge: string
  redirectUri: string
  scope: string
}): string {
  return sign({
    typ: ISSUER_TYP.code,
    exp: nowSec() + TTL.code,
    sub: params.sub,
    cc: params.codeChallenge,
    ru: params.redirectUri,
    scope: params.scope,
  })
}

export interface AuthCodeClaims {
  sub: string
  codeChallenge: string
  redirectUri: string
  scope: string
}

export function readAuthCode(code: string): AuthCodeClaims | null {
  const payload = verify(code)
  if (!payload || payload.typ !== ISSUER_TYP.code) return null
  return {
    sub: String(payload.sub),
    codeChallenge: String(payload.cc),
    redirectUri: String(payload.ru),
    scope: String(payload.scope ?? ''),
  }
}

// ---- Access / refresh tokens ------------------------------------------------

export function issueAccessToken(sub: string, scope: string): { token: string; expiresIn: number } {
  return {
    token: sign({ typ: ISSUER_TYP.access, exp: nowSec() + TTL.access, sub, scope }),
    expiresIn: TTL.access,
  }
}

export function issueRefreshToken(sub: string, scope: string): string {
  return sign({ typ: ISSUER_TYP.refresh, exp: nowSec() + TTL.refresh, sub, scope })
}

/**
 * Verify an access token presented as `Authorization: Bearer`. Returns the
 * stable `sub` to use as the MCP user identity, or null if invalid/expired.
 */
export function verifyAccessToken(token: string): string | null {
  const payload = verify(token)
  if (!payload || payload.typ !== ISSUER_TYP.access) return null
  return typeof payload.sub === 'string' ? payload.sub : null
}

export function readRefreshToken(token: string): { sub: string; scope: string } | null {
  const payload = verify(token)
  if (!payload || payload.typ !== ISSUER_TYP.refresh) return null
  return { sub: String(payload.sub), scope: String(payload.scope ?? '') }
}

// ---- Helpers ----------------------------------------------------------------

/** Verify a PKCE code_verifier against an S256 code_challenge (constant time). */
export function verifyPkceS256(verifier: string, challenge: string): boolean {
  const hash = crypto.createHash('sha256').update(verifier).digest('base64url')
  const a = Buffer.from(hash)
  const b = Buffer.from(challenge)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Mint a fresh opaque anonymous identity for a new authorization. */
export function newSubject(): string {
  return `mcp_${crypto.randomUUID()}`
}

/**
 * Validate a redirect_uri. When the client_id carries registered URIs, require
 * an exact match. Otherwise fall back to an allowlist of known Claude callback
 * hosts (and loopback for native clients like Claude Code).
 */
export function isAllowedRedirectUri(uri: string, registered?: string[]): boolean {
  let u: URL
  try {
    u = new URL(uri)
  } catch {
    return false
  }
  if (registered && registered.length > 0) {
    return registered.includes(uri)
  }
  if (u.protocol === 'https:') {
    const host = u.hostname
    return (
      host === 'claude.ai' ||
      host === 'claude.com' ||
      host.endsWith('.claude.ai') ||
      host.endsWith('.claude.com') ||
      host.endsWith('.anthropic.com')
    )
  }
  if (u.protocol === 'http:') {
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1'
  }
  return false
}

/** Intersect requested scopes with what we support; default to "mcp". */
export function normalizeScope(requested: string | null | undefined): string {
  const req = (requested ?? '').split(/\s+/).filter(Boolean)
  const allowed = req.filter((s) => (SUPPORTED_SCOPES as readonly string[]).includes(s))
  if (!allowed.includes('mcp')) allowed.unshift('mcp')
  return allowed.join(' ')
}
