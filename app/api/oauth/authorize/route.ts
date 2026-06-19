import { NextRequest } from 'next/server'
import {
  issueAuthCode,
  newSubject,
  normalizeScope,
  readClientId,
  isAllowedRedirectUri,
} from '@/lib/mcp/oauth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * OAuth 2.1 authorization endpoint. Skill Me has no user accounts, so there is
 * no login or consent screen: we validate the request, mint a fresh anonymous
 * identity, and immediately redirect back with an authorization code bound to
 * the caller's PKCE challenge. The connector popup opens and closes in one hop.
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

  const code = issueAuthCode({
    sub: newSubject(),
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
