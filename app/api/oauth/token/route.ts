import { NextRequest } from 'next/server'
import {
  readAuthCode,
  readRefreshToken,
  issueAccessToken,
  issueRefreshToken,
  verifyPkceS256,
} from '@/lib/mcp/oauth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Token responses must never be cached (RFC 6749 §5.1).
const RESPONSE_HEADERS = { ...CORS, 'Cache-Control': 'no-store', Pragma: 'no-cache' }

const MAX_BODY_BYTES = 64 * 1024

function tokenError(error: string, description: string, status = 400): Response {
  return Response.json(
    { error, error_description: description },
    { status, headers: RESPONSE_HEADERS }
  )
}

/**
 * Parse the token request body. OAuth mandates form-encoded bodies, but accept
 * JSON too since some clients send it.
 */
async function parseParams(req: NextRequest): Promise<Record<string, string>> {
  const ct = req.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    const json = (await req.json()) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(json).map(([k, v]) => [k, typeof v === 'string' ? v : String(v ?? '')])
    )
  }
  const form = await req.formData()
  const out: Record<string, string> = {}
  for (const [k, v] of form.entries()) out[k] = typeof v === 'string' ? v : ''
  return out
}

export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return tokenError('invalid_request', 'Request body too large', 413)
  }

  let params: Record<string, string>
  try {
    params = await parseParams(req)
  } catch {
    return tokenError('invalid_request', 'Could not parse request body')
  }

  const grantType = params.grant_type

  if (grantType === 'authorization_code') {
    const code = params.code
    const codeVerifier = params.code_verifier
    const redirectUri = params.redirect_uri

    if (!code || !codeVerifier) {
      return tokenError('invalid_request', 'code and code_verifier are required')
    }

    const claims = readAuthCode(code)
    if (!claims) {
      return tokenError('invalid_grant', 'Authorization code is invalid or expired')
    }
    // redirect_uri, when supplied, must match the one bound to the code.
    if (redirectUri && redirectUri !== claims.redirectUri) {
      return tokenError('invalid_grant', 'redirect_uri does not match the authorization request')
    }
    if (!verifyPkceS256(codeVerifier, claims.codeChallenge)) {
      return tokenError('invalid_grant', 'PKCE verification failed')
    }

    const access = issueAccessToken(claims.sub, claims.scope)
    const body: Record<string, unknown> = {
      access_token: access.token,
      token_type: 'Bearer',
      expires_in: access.expiresIn,
      scope: claims.scope,
    }
    if (claims.scope.split(/\s+/).includes('offline_access')) {
      body.refresh_token = issueRefreshToken(claims.sub, claims.scope)
    }
    return Response.json(body, { headers: RESPONSE_HEADERS })
  }

  if (grantType === 'refresh_token') {
    const refresh = readRefreshToken(params.refresh_token ?? '')
    if (!refresh) {
      return tokenError('invalid_grant', 'Refresh token is invalid or expired')
    }
    const access = issueAccessToken(refresh.sub, refresh.scope)
    return Response.json(
      {
        access_token: access.token,
        token_type: 'Bearer',
        expires_in: access.expiresIn,
        scope: refresh.scope,
      },
      { headers: RESPONSE_HEADERS }
    )
  }

  return tokenError('unsupported_grant_type', `Unsupported grant_type: ${grantType ?? '(none)'}`)
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
