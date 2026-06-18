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
}

export default nextConfig
