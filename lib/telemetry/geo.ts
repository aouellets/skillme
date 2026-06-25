/**
 * Coarse, non-PII geo from Vercel edge headers — the single source of truth for
 * "where is this request from" across the web ingest, the auth/signup callback,
 * and the MCP route. We capture country / region / city PLUS an approximate
 * coordinate (lat/lng) so the admin world-map can plot adoption.
 *
 * Still NO raw IP, and the coordinates are deliberately coarsened: Vercel's
 * `x-vercel-ip-latitude` / `x-vercel-ip-longitude` are already a network-edge /
 * city-centroid approximation (not device GPS), and we round them to 2 decimals
 * (~1.1 km) at capture time so a precise point never persists at rest. This is
 * a deliberate, documented relaxation of the earlier "no coordinates" stance
 * (see docs/telemetry.md and app/privacy) — kept non-identifying by the
 * combination of edge-approximation + rounding + no-IP.
 *
 * Vercel URL-encodes the city header (e.g. `San%20Francisco`), so we decode it.
 * Returns a plain object suitable for the telemetry `context.geo` slot; callers
 * wrap it as `{ geo }` only when at least one field is present.
 */
export interface CoarseGeo {
  country?: string
  region?: string
  city?: string
  /** Approximate latitude, rounded to 2 decimals (~1.1 km). Never raw. */
  lat?: number
  /** Approximate longitude, rounded to 2 decimals (~1.1 km). Never raw. */
  lng?: number
}

function decode(value: string | null): string | undefined {
  if (!value) return undefined
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** Parse a header coordinate and coarsen it to 2 decimals, or undefined when
 *  absent / non-numeric (e.g. off-Vercel local dev sends no such header). */
function coord(value: string | null): number | undefined {
  if (!value) return undefined
  const n = Number.parseFloat(value)
  if (!Number.isFinite(n)) return undefined
  return Math.round(n * 100) / 100
}

/** Extract coarse geo from a request's headers. Empty object when none present. */
export function coarseGeo(headers: Headers): CoarseGeo {
  const geo: CoarseGeo = {}
  const country = headers.get('x-vercel-ip-country')
  const region = headers.get('x-vercel-ip-country-region')
  const city = decode(headers.get('x-vercel-ip-city'))
  const lat = coord(headers.get('x-vercel-ip-latitude'))
  const lng = coord(headers.get('x-vercel-ip-longitude'))
  if (country) geo.country = country
  if (region) geo.region = region
  if (city) geo.city = city
  if (lat !== undefined) geo.lat = lat
  if (lng !== undefined) geo.lng = lng
  return geo
}

/** `{ geo }` context wrapper, or `{}` when no geo could be resolved. */
export function geoContext(headers: Headers): Record<string, unknown> {
  const geo = coarseGeo(headers)
  return Object.keys(geo).length ? { geo } : {}
}
