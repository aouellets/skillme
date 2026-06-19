import { SITE_URL, MCP_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version',
}

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728). Served (via rewrites) at
 * /.well-known/oauth-protected-resource and the path-suffixed variant so the
 * MCP connector can discover which authorization server protects this resource.
 */
export function GET() {
  return Response.json(
    {
      resource: MCP_URL,
      authorization_servers: [SITE_URL],
      scopes_supported: ['mcp', 'offline_access'],
      bearer_methods_supported: ['header'],
      resource_documentation: `${SITE_URL}/connect`,
    },
    { headers: CORS }
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
