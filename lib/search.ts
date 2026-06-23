/** Max number of query terms we feed into a tsquery (cheap DoS guard). */
const MAX_TS_TERMS = 8

/**
 * Split a raw search string into individual lowercased word tokens.
 *
 * Strips everything except letters/digits/spaces, so the result is safe to use
 * both in an in-memory `includes()` filter and as a `to_tsquery` lexeme (the
 * stripping is what prevents `to_tsquery` syntax errors / filter injection —
 * no `&`, `|`, `!`, `:`, `*`, quotes, or parens survive). Capped at
 * {@link MAX_TS_TERMS} terms.
 */
export function searchTerms(raw: string | undefined | null): string[] {
  if (!raw) return []
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_TS_TERMS)
}

/**
 * Build a prefix, AND-combined `to_tsquery` expression from raw user input for
 * use with PostgREST `.textSearch(col, q, { config: 'english' })` (the default,
 * type-less form maps to `to_tsquery`).
 *
 * Each token becomes a prefix term, combined with `op` (default `&` = all
 * required), e.g. `issue tracker` -> `issue:* & track:*`. The `:*` keeps live
 * "as-you-type" matching working (a half-typed trailing word still matches) and
 * the shared `english` config gives stemming (`tracker` ~ `tracking`).
 *
 * Pass `op: '|'` for an any-term (OR) query — the recall fallback callers use
 * when the strict AND match comes up empty (one stray/imprecise word shouldn't
 * zero out an otherwise good search).
 *
 * Returns '' when nothing searchable remains; callers should skip the filter.
 */
export function toTsQuery(raw: string | undefined | null, op: '&' | '|' = '&'): string {
  const terms = searchTerms(raw)
  if (terms.length === 0) return ''
  return terms.map((t) => `${t}:*`).join(` ${op} `)
}
