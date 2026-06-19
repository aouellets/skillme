import { NextRequest } from 'next/server'
import { issueClientId } from '@/lib/mcp/oauth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const MAX_BODY_BYTES = 64 * 1024
const MAX_REDIRECT_URIS = 10

/**
 * Dynamic Client Registration (RFC 7591). We don't authenticate clients (public
 * clients using PKCE), so registration is open: we echo back a stateless
 * client_id that encodes the requested redirect URIs. No client_secret is
 * issued — the token endpoint relies on PKCE, not a client credential.
 */
export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return Response.json(
      { error: 'invalid_request', error_description: 'Request body too large' },
      { status: 413, headers: CORS }
    )
  }

  let body: { redirect_uris?: unknown; client_name?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json(
      { error: 'invalid_client_metadata', error_description: 'Body must be JSON' },
      { status: 400, headers: CORS }
    )
  }

  const redirectUris = Array.isArray(body.redirect_uris)
    ? body.redirect_uris.filter((u): u is string => typeof u === 'string')
    : []

  if (redirectUris.length === 0) {
    return Response.json(
      { error: 'invalid_redirect_uri', error_description: 'redirect_uris is required' },
      { status: 400, headers: CORS }
    )
  }
  if (redirectUris.length > MAX_REDIRECT_URIS) {
    return Response.json(
      { error: 'invalid_redirect_uri', error_description: 'Too many redirect_uris' },
      { status: 400, headers: CORS }
    )
  }
  // Each redirect_uri must be a syntactically valid absolute URL.
  for (const uri of redirectUris) {
    try {
      void new URL(uri)
    } catch {
      return Response.json(
        { error: 'invalid_redirect_uri', error_description: `Invalid redirect_uri: ${uri}` },
        { status: 400, headers: CORS }
      )
    }
  }

  const clientId = issueClientId(redirectUris)
  const clientName = typeof body.client_name === 'string' ? body.client_name : 'MCP Client'

  return Response.json(
    {
      client_id: clientId,
      client_name: clientName,
      redirect_uris: redirectUris,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
      client_id_issued_at: Math.floor(Date.now() / 1000),
    },
    { status: 201, headers: CORS }
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
