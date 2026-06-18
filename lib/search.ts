/**
 * Sanitize a user-supplied search term for safe interpolation into a PostgREST
 * `.or(...)` / `ilike` filter string.
 *
 * PostgREST parses commas and parentheses as filter *syntax* (clause separators
 * and grouping), not as data — so interpolating raw user input into an
 * `.or('name.ilike.%term%,...')` expression allows filter injection: a caller
 * can inject extra clauses, reference other columns, or break the query. We
 * neutralise the structural metacharacters and the LIKE wildcards so the term
 * is matched as a literal, case-insensitive substring, and bound its length as
 * a cheap DoS guard.
 *
 * Returns an empty string when nothing searchable remains; callers should skip
 * the filter in that case.
 */
export function sanitizeSearchTerm(raw: string | undefined | null): string {
  if (!raw) return ''
  return raw
    .replace(/[,()]/g, ' ') // PostgREST .or() structural characters
    .replace(/[%_*\\]/g, '') // LIKE / PostgREST wildcards + escape char
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}
