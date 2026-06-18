---
name: Next.js App Router
description: Build with the Next.js App Router using server components, correct data fetching, and streaming by default.
---

# Next.js App Router

Default to Server Components; reach for Client Components only when you need
interactivity, state, or browser APIs.

## Core rules
- Mark a file `'use client'` only at the leaf that needs it — keep client
  boundaries small so most of the tree stays server-rendered.
- Fetch data in server components with `async`/`await`; no `useEffect` data
  fetching unless it's genuinely client-driven.
- Pass data down as props; don't lift everything into client state.
- Use `loading.tsx` and `<Suspense>` to stream — show structure fast, fill in
  slow data.
- `error.tsx` for route-level error boundaries; `not-found.tsx` for 404s.

## Caching & dynamics
- Be explicit: `export const dynamic = 'force-dynamic'` for per-request data,
  or rely on static + `revalidate` for cacheable content.
- Remember `fetch` is cached by default — opt out with `{ cache: 'no-store' }`
  when you need fresh data.

## Server Actions
- Use them for mutations; validate input on the server, never trust the client.
- Revalidate affected paths/tags after a mutation.

## Checklist
1. Is this component client-only for a real reason? If not, keep it server.
2. Is there a loading state for every async boundary?
3. Are dynamic vs cached choices explicit, not accidental?
