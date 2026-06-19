import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version',
}

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414). Served (via rewrites) at
 * /.well-known/oauth-authorization-server and /.well-known/openid-configuration.
 * Advertises a public-client (PKCE, no secret) authorization-code flow with
 * Dynamic Client Registration — the shape claude.ai's connector flow expects.
 */
export function GET() {
  return Response.json(
    {
      issuer: SITE_URL,
      authorization_endpoint: `${SITE_URL}/api/oauth/authorize`,
      token_endpoint: `${SITE_URL}/api/oauth/token`,
      registration_endpoint: `${SITE_URL}/api/oauth/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      scopes_supported: ['mcp', 'offline_access'],
      service_documentation: `${SITE_URL}/connect`,
    },
    { headers: CORS }
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
