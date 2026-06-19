import type { NextConfig } from 'next'

/**
 * Baseline security headers applied to every route. Kept conservative so they
 * don't break the app: no strict CSP (Next injects inline runtime scripts), but
 * clickjacking, MIME-sniffing, referrer leakage, and unwanted browser features
 * are all locked down. HSTS is safe — the site is HTTPS-only on Vercel.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  /**
   * Serve OAuth discovery documents from their standard root `.well-known`
   * locations. They are implemented as API route handlers (so they can read
   * env-derived URLs) and mapped here, which avoids the Next.js app-router
   * quirks around dot-prefixed route segments. The path-suffixed variants
   * (e.g. .../oauth-protected-resource/api/mcp) are what RFC 9728 clients probe
   * when the protected resource has a path.
   */
  async rewrites() {
    return [
      {
        source: '/.well-known/oauth-protected-resource',
        destination: '/api/oauth/metadata/protected-resource',
      },
      {
        source: '/.well-known/oauth-protected-resource/:path*',
        destination: '/api/oauth/metadata/protected-resource',
      },
      {
        source: '/.well-known/oauth-authorization-server',
        destination: '/api/oauth/metadata/authorization-server',
      },
      {
        source: '/.well-known/oauth-authorization-server/:path*',
        destination: '/api/oauth/metadata/authorization-server',
      },
      {
        source: '/.well-known/openid-configuration',
        destination: '/api/oauth/metadata/authorization-server',
      },
    ]
  },
}

export default nextConfig
