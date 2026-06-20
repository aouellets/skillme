import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refresh the Supabase auth session on navigation so server components see a
 * current user. No-ops when auth env isn't configured. The matcher excludes
 * /api so the MCP endpoint stays fast and untouched.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  try {
    await supabase.auth.getUser()
  } catch {
    // Network/auth hiccup shouldn't block the request.
  }

  return response
}

export const config = {
  // Exclude /api broadly so the high-traffic MCP endpoint stays fast and
  // untouched — EXCEPT /api/oauth/authorize, which must see a current session to
  // bind the connector to the signed-in account (auth:<id>) rather than silently
  // falling back to an anonymous identity when the access-token cookie is stale.
  // Running the refresh here rotates that cookie (onto request + response) before
  // the authorize handler reads it.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    '/api/oauth/authorize',
  ],
}
