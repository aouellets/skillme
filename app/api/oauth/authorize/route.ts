import { NextRequest } from 'next/server'
import {
  issueAuthCode,
  newSubject,
  normalizeScope,
  readClientId,
  isAllowedRedirectUri,
} from '@/lib/mcp/oauth'
import { getUserToken } from '@/lib/userToken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * OAuth 2.1 authorization endpoint.
 *
 * Identity is HYBRID. The `sub` we bind into the authorization code becomes the
 * partition key for the caller's installed-skill library, so it must be stable
 * for installs to persist:
 *
 *  - Signed in to Skill Me (cookie present) → `sub = auth:<user.id>`, the SAME
 *    identity the website uses. The connector library and the website library
 *    (`/library`) are then one and the same, and survive every reconnect/refresh.
 *    Approved silently — no extra hop.
 *  - Not signed in → show a short consent page recommending sign-in (so the
 *    library stays synced), with a one-click "continue without signing in"
 *    escape hatch (`anon=1`) that mints a throwaway anonymous identity. This
 *    preserves the previous zero-account behavior for anyone who wants it.
 *
 * PKCE (S256) is mandatory — without it the code could be intercepted and
 * replayed, since there is no client secret.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const responseType = p.get('response_type')
  const clientId = p.get('client_id')
  const redirectUri = p.get('redirect_uri')
  const state = p.get('state')
  const codeChallenge = p.get('code_challenge')
  const codeChallengeMethod = p.get('code_challenge_method')
  const scope = normalizeScope(p.get('scope'))

  // redirect_uri must be present and trusted before we can safely redirect any
  // error back to it; otherwise fail closed with a plain response.
  if (!redirectUri) {
    return badRequest('missing redirect_uri')
  }
  const registered = clientId ? readClientId(clientId)?.redirectUris : undefined
  if (!isAllowedRedirectUri(redirectUri, registered)) {
    return badRequest('redirect_uri is not allowed')
  }

  if (responseType !== 'code') {
    return redirectError(redirectUri, state, 'unsupported_response_type')
  }
  if (!codeChallenge || codeChallengeMethod !== 'S256') {
    return redirectError(
      redirectUri,
      state,
      'invalid_request',
      'PKCE with code_challenge_method=S256 is required'
    )
  }

  // Prefer the signed-in account identity so the library is stable and shared
  // with the website. `auth:<id>` or null.
  const accountSub = await getUserToken()

  // Not signed in and hasn't opted into anonymous yet: recommend signing in.
  // Signed-in callers skip this entirely and are approved silently.
  if (!accountSub && p.get('anon') !== '1') {
    return consentPage(req)
  }

  const sub = accountSub ?? newSubject()

  const code = issueAuthCode({
    sub,
    codeChallenge,
    redirectUri,
    scope,
  })

  const dest = new URL(redirectUri)
  dest.searchParams.set('code', code)
  if (state) dest.searchParams.set('state', state)

  return Response.redirect(dest.toString(), 302)
}

function badRequest(message: string): Response {
  return new Response(`Invalid authorization request: ${message}`, {
    status: 400,
    headers: { 'Content-Type': 'text/plain' },
  })
}

function redirectError(
  redirectUri: string,
  state: string | null,
  error: string,
  description?: string
): Response {
  const dest = new URL(redirectUri)
  dest.searchParams.set('error', error)
  if (description) dest.searchParams.set('error_description', description)
  if (state) dest.searchParams.set('state', state)
  return Response.redirect(dest.toString(), 302)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Consent interstitial shown only to callers who aren't signed in. Recommends
 * signing in (so the library syncs across web + Claude and persists), with a
 * low-friction anonymous continue. Both links are same-origin paths derived from
 * the already-validated request — the OAuth params round-trip untouched.
 */
function consentPage(req: NextRequest): Response {
  const url = new URL(req.url)

  // The in-app path (with query) to return to after login, and the same path
  // with anon=1 for the "continue without signing in" choice. URLSearchParams
  // percent-encodes all param values; encodeURIComponent encodes the whole path
  // for the login `next` — so no raw input reaches the HTML unescaped.
  const authorizePath = `${url.pathname}${url.search}`
  const loginHref = escapeHtml(`/login?next=${encodeURIComponent(authorizePath)}`)

  const anonUrl = new URL(url)
  anonUrl.searchParams.set('anon', '1')
  const anonHref = escapeHtml(`${anonUrl.pathname}${anonUrl.search}`)

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Connect Skill Me</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #0a0a0a; color: #fafafa;
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 24px;
  }
  .card {
    width: 100%; max-width: 420px; background: #141414;
    border: 1px solid #262626; border-radius: 16px; padding: 32px;
  }
  .mark { font-weight: 700; font-size: 18px; letter-spacing: -0.01em; }
  .mark span { color: #bef264; }
  h1 { font-size: 20px; margin: 20px 0 8px; letter-spacing: -0.01em; }
  p { margin: 0 0 20px; color: #a3a3a3; }
  .btn {
    display: block; width: 100%; text-align: center; text-decoration: none;
    padding: 12px 16px; border-radius: 10px; font-weight: 600; margin-top: 10px;
  }
  .btn-primary { background: #bef264; color: #0a0a0a; }
  .btn-ghost { color: #a3a3a3; border: 1px solid #262626; }
  .hint { font-size: 13px; color: #737373; margin: 16px 0 0; text-align: center; }
</style>
</head>
<body>
  <main class="card">
    <div class="mark">Skill<span>Me</span></div>
    <h1>Connect to Skill Me</h1>
    <p>Sign in to keep one library of installed skills synced across the website and Claude. It’ll persist every time you reconnect.</p>
    <a class="btn btn-primary" href="${loginHref}">Sign in to sync my skills</a>
    <a class="btn btn-ghost" href="${anonHref}">Continue without signing in</a>
    <p class="hint">Without signing in, skills you install are tied to this connection and won’t carry over if you reconnect.</p>
  </main>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
