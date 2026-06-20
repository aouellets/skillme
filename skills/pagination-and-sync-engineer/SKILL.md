---
name: Pagination and Sync Engineer
description: Build correct cursor pagination and incremental delta sync against a paginated API, handling inserts, deletes, watermarks, resumability, and idempotency. Use when paging a list/changes endpoint, fetching a large dataset, or keeping a local copy in sync — especially when a sync skips or duplicates rows, you have an offset/page=N loop, or you are designing a cursor or updated_at watermark. Do NOT use when generating a typed API client or SDK from a spec — use api-client-generator instead.
---
# Pagination and Sync Engineer

Make paging and delta sync correct against a dataset that mutates mid-walk: never skip, never double-count, and survive interruption. A naive page loop drops and duplicates rows the instant the underlying data changes, so treat the dataset as a moving target that must be resumable and idempotent.

## Workflow

1. **Replace offset with cursor (keyset) pagination.** Offset (LIMIT/OFFSET, page=N) is broken under writes: an insert or delete before your offset shifts every later row, skipping or repeating records, and deep offsets get slow. Use a cursor encoding the last item's stable sort key. Treat the cursor as opaque — never parse, fabricate, or persist a derived form of it; pass back exactly what the server returned.
2. **Sort by a total order.** Pagination correctness requires a unique, stable ordering. Sort by a monotonic unique key, or a (timestamp, id) tiebreak — sorting by a non-unique column drops rows at page boundaries. For delta sync the ordering key is normally (updated_at, id).
3. **Drive incremental sync from a persisted watermark.** Store the max updated_at fully processed. Next run, request records with updated_at >= watermark; use >= not >, and dedupe by id, because rows can share a timestamp and a strict > skips them. Subtract a small safety margin (a few seconds) from the watermark to tolerate clock skew and commit lag on the source.
4. **Capture deletes explicitly.** A feed of changed rows cannot express deletions — the row is just absent. Prefer a source with soft deletes (deleted_at) or a tombstone/changes feed and propagate removals. If none exists, periodically reconcile with a full ID sweep and delete local rows the source no longer returns.
5. **Checkpoint after every durably-processed page.** Persist the cursor or watermark only after a page is committed locally, so a crash resumes mid-stream, not from zero. Never advance the watermark before the page's rows are durable.
6. **Make reprocessing harmless.** Upsert by primary key so replaying a page is a no-op. Bound page size, honor rate limits with backoff, and retry transient failures on the same cursor.

## Quality bar

- Inserting or deleting rows in the source mid-walk never causes a skipped or duplicated row downstream.
- Killing the process at any point and rerunning produces the same final local state (idempotent, resumable from checkpoint).
- Deletions in the source are reflected locally, not left as orphans.
- The watermark comparison is `>=` with id-level dedupe, and advances only after durable processing.

## Do NOT

- Do NOT use OFFSET/page-number paging for any dataset that can change during the walk.
- Do NOT parse, reconstruct, or compare cursors — they are opaque server tokens.
- Do NOT use `>` for the watermark or assume timestamps are unique.
- Do NOT advance the watermark or cursor before the page is committed locally.
- Do NOT scaffold a typed client or SDK here — that is api-client-generator's job; this skill owns paging and sync correctness only.

## When to skip

A small, bounded, rarely-changing dataset can be fetched in one full pull. The cursor-plus-watermark machinery earns its place on large or actively-mutating datasets you sync repeatedly.
