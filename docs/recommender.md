# Semantic recommender

The `recommend_skills` MCP tool turns a free-text task into the most relevant
skills and the best-fit pack — each with a one-line reason and an install id. It
is the smart entry point to the catalog: instead of guessing keywords, the user
(or Claude, proactively) describes what they're doing and gets back the skills
that fit, even when the task shares no words with the skill.

## Flow

```
task text
  → embed (OpenAI text-embedding-3-small)          lib/embeddings.ts
  → pgvector cosine top-k                           match_skills / match_packs RPC
  → rerank + write reasons (OpenAI gpt-4o-mini)     lib/recommend-rerank.ts
  → ranked shortlist + best pack                    lib/mcp/tools/recommend.ts
```

Every stage degrades gracefully. If there is no embedding credential, no
Supabase, or an RPC error, retrieval falls back to the lexical `getSkills` /
`getPacks` search. If the rerank credential is missing or the call fails, results
fall back to vector order with templated reasons. The tool never hard-fails, and
telemetry (`skill_recommended`) records `mode` (`semantic` | `lexical`) and
`used_rerank` so we can see how often it runs degraded.

It fires two ways: **proactively** — the MCP server `instructions` tell Claude to
call it at the start of a non-trivial task — and **on demand** when the user asks
for a recommendation.

## Data model (migration 0009)

- `skills.embedding` / `packs.embedding` — `vector(1536)`, HNSW cosine index.
- `skills.embedding_hash` / `packs.embedding_hash` — sha256 of the embedding
  input, so backfills skip unchanged rows.
- `match_skills(query_embedding, match_count, exclude_ids)` and
  `match_packs(...)` — cosine top-k, `security invoker` (the existing public-read
  RLS on skills/packs scopes them; no `security definer`).

The `vector(1536)` dimension is coupled to `text-embedding-3-small`. Switching to
a model with a different dimension means a column migration **and** a full
re-embed.

## Keeping embeddings fresh

A skill/pack is recommendable only once embedded. Coverage is maintained two ways:

- **Automatically on ingest.** `lib/ingest.ts` embeds each skill/pack inline right
  after upsert (best-effort), so the weekly discovery cron (`/api/cron/scout`)
  and any manual ingest keep the recommender complete with no extra step.
- **Backfill after seeding.** The manual seed path does not embed, so after
  `db:seed` / `db:seed-packs` (or any bulk content change) run:

  ```bash
  npm run embed:catalog          # incremental: only new/changed rows
  npm run embed:catalog -- --all # force a full re-embed (e.g. model change)
  ```

## Configuration

- `OPENAI_API_KEY` — embeddings (query + backfill) and rerank. **Required in the
  runtime env** for the live tool to run in semantic mode; set in Vercel
  production. The Vercel AI Gateway free tier rate-limits embedding models, which
  is why this is a direct OpenAI key rather than a gateway route.
- `EMBEDDING_MODEL` — default `openai/text-embedding-3-small` (gateway-prefixed;
  the direct-OpenAI path strips the prefix).
- `RERANK_MODEL` — default `gpt-4o-mini`.

Without `OPENAI_API_KEY` the tool still works in lexical/templated mode.

## Files

| File | Role |
|---|---|
| `supabase/migrations/0009_pgvector_embeddings.sql` | extension, columns, indexes, match RPCs |
| `lib/embeddings.ts` | embedding input builders, hashing, `embedTexts` (OpenAI-direct + gateway fallback) |
| `scripts/embed-catalog.ts` (`npm run embed:catalog`) | hash-skipping backfill |
| `lib/recommend.ts` | retrieve (semantic) with lexical fallback |
| `lib/recommend-rerank.ts` | optional rerank + reasons |
| `lib/mcp/tools/recommend.ts` | the `recommend_skills` MCP tool |
| `lib/ingest.ts` | embeds new skills/packs inline on upsert |
