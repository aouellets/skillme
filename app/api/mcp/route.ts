import { NextRequest } from 'next/server'
import { createMCPServer } from '@/lib/mcp/server'
import { verifyAccessToken } from '@/lib/mcp/oauth'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Reject oversized payloads before parsing — a cheap guard against memory-abuse
// / amplification via huge JSON bodies or batches. 256 KB is generous for
// JSON-RPC tool calls.
const MAX_BODY_BYTES = 256 * 1024

// NOTE: Access-Control-Allow-Origin is intentionally `*`. The endpoint carries
// no ambient/cookie credentials — identity is a bearer token in X-User-Token /
// Mcp-Session-Id over the caller's own TLS connection — so a wildcard origin
// does not enable a CSRF-style cross-site authenticated request. Revisit this
// if identity ever moves to cookies.
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-User-Token, x-session-id, Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, WWW-Authenticate',
}

// Point unauthenticated/invalid callers at the protected-resource metadata so
// the client can run the OAuth flow (RFC 9728 §5.1).
const WWW_AUTHENTICATE = `Bearer resource_metadata="${SITE_URL}/.well-known/oauth-protected-resource"`

type TokenResolution =
  | { kind: 'ok'; token: string | null }
  | { kind: 'invalid' }

/**
 * Derive a stable per-user token from the caller's credentials. Prefers an
 * `Authorization: Bearer` access token minted by our OAuth flow (the path
 * claude.ai's connector uses): its signed `sub` becomes the identity. Falls
 * back to the bearer-style headers older clients persist across a connection.
 *
 * Returns `{ kind: 'invalid' }` when a Bearer token is presented but fails
 * verification (expired/forged) so the caller can be told to re-authenticate,
 * rather than silently downgrading to an anonymous identity. Returns a null
 * token when no credential is presented at all — read-only catalog tools still
 * work; state-changing tools require a non-null token (enforced per-tool).
 */
function getUserToken(req: NextRequest): TokenResolution {
  const auth = req.headers.get('authorization')
  if (auth && /^bearer\s+/i.test(auth)) {
    const sub = verifyAccessToken(auth.replace(/^bearer\s+/i, '').trim())
    if (!sub) return { kind: 'invalid' }
    return { kind: 'ok', token: sub }
  }

  return {
    kind: 'ok',
    token:
      req.headers.get('x-user-token') ??
      req.headers.get('x-session-id') ??
      req.headers.get('mcp-session-id') ??
      null,
  }
}

export async function POST(req: NextRequest) {
  const resolved = getUserToken(req)
  if (resolved.kind === 'invalid') {
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32001, message: 'Invalid or expired access token' },
      },
      {
        status: 401,
        headers: { ...CORS_HEADERS, 'WWW-Authenticate': WWW_AUTHENTICATE },
      }
    )
  }
  const userToken = resolved.token

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Request body too large' },
      },
      { status: 413, headers: CORS_HEADERS }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: invalid JSON' },
      },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  const method = Array.isArray(body) ? 'batch' : (body as { method?: string })?.method ?? 'unknown'
  // Do not log the user token: it is a bearer credential for the user's library.
  console.log(`[MCP] ${method}`)

  // Advertise a session id the client should send back on later requests. Echo
  // the caller's existing token, or assign a fresh one for new connections.
  const sessionId = userToken ?? crypto.randomUUID()

  try {
    const server = createMCPServer(userToken)
    const response = await server.handle(body as never)

    // Notifications produce no response body.
    if (response === null) {
      return new Response(null, {
        status: 202,
        headers: { ...CORS_HEADERS, 'Mcp-Session-Id': sessionId },
      })
    }

    return Response.json(response, {
      headers: { ...CORS_HEADERS, 'Mcp-Session-Id': sessionId },
    })
  } catch (err) {
    // Log the detail server-side; never leak internal error text to the client.
    console.error('[MCP] Unhandled error:', err)
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: 'Internal server error' },
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

// Some MCP clients probe with GET to open a stream; we are POST-only JSON.
export async function GET() {
  return new Response('Skill Me MCP endpoint. Use POST with JSON-RPC 2.0.', {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
  })
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}
