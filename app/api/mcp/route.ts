import { NextRequest } from 'next/server'
import { createMCPServer } from '@/lib/mcp/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-User-Token, x-session-id, Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
}

/**
 * Derive a stable per-user token. claude.ai connectors persist headers across a
 * connection, so installs stay tied to the same user. Falls back to a generated
 * UUID when no identifying header is present.
 */
function getUserToken(req: NextRequest): string {
  return (
    req.headers.get('x-user-token') ??
    req.headers.get('x-session-id') ??
    req.headers.get('mcp-session-id') ??
    crypto.randomUUID()
  )
}

export async function POST(req: NextRequest) {
  const userToken = getUserToken(req)

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
  console.log(`[MCP] ${method} — token: ${userToken.slice(0, 8)}…`)

  try {
    const server = createMCPServer(userToken)
    const response = await server.handle(body as never)

    // Notifications produce no response body.
    if (response === null) {
      return new Response(null, { status: 202, headers: CORS_HEADERS })
    }

    return Response.json(response, {
      headers: { ...CORS_HEADERS, 'Mcp-Session-Id': userToken },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[MCP] Unhandled error:', err)
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: `Internal error: ${message}` },
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
