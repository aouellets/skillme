import { NextRequest } from 'next/server'
import { createMCPServer } from '@/lib/mcp/server'

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
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
}

/**
 * Derive a stable per-user token from the bearer-style headers claude.ai
 * connectors persist across a connection. Returns null when the caller has not
 * presented one yet (e.g. a brand-new connection's first `initialize`): we no
 * longer mint a throwaway per-request UUID as identity, because that silently
 * created an unauthenticated, uncorrelated identity for state-changing calls.
 * State-changing tools require a non-null token (enforced per-tool); the
 * response advertises a session id the client reuses on subsequent requests.
 */
function getUserToken(req: NextRequest): string | null {
  return (
    req.headers.get('x-user-token') ??
    req.headers.get('x-session-id') ??
    req.headers.get('mcp-session-id') ??
    null
  )
}

export async function POST(req: NextRequest) {
  const userToken = getUserToken(req)

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
