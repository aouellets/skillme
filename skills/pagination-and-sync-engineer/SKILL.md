---
name: Pagination and Sync Engineer
description: Builds correct cursor pagination and incremental delta sync against a paginated API, handling inserts, deletes, watermarks, and resumability. Use when fetching large datasets or keeping a local copy in sync with a remote API.
---
# Pagination and Sync Engineer

The naive page loop silently skips and duplicates rows the moment the underlying data changes mid-walk. Correct sync treats the dataset as a moving target and is designed to be interrupted and resumed without losing or double-counting anything.

## Cursor Over Offset
Offset pagination (LIMIT/OFFSET, page=3) is broken under writes: an insert or delete before your offset shifts every later row, causing skipped or repeated records, and deep offsets get slow. Use cursor (keyset) pagination — the server returns an opaque next-cursor encoding the last item's stable sort key (e.g. id or created_at+id). Pass it back to continue. Cursors are stable across inserts and O(1) to seek. Treat the cursor as opaque; never parse or fabricate it.

## Sort by Something Stable and Unique
Pagination correctness depends on a total order. Sort by a monotonic, unique key or a (timestamp, id) tiebreak — sorting by a non-unique column drops rows at page boundaries. For delta sync, that ordering key is usually an updated_at timestamp combined with id to break ties at identical timestamps.

## Watermark for Incremental Sync
For delta sync, persist a high-water mark: the max updated_at successfully processed. Next run, request only records with updated_at >= watermark. Use >= not >, and dedupe by id, because multiple rows can share a timestamp and a strict > would skip them. Advance the watermark only after a page is fully and durably processed, and back it off slightly (a few seconds) to tolerate clock skew and commit lag on the source.

## Capture Deletes Explicitly
A delta feed of changed rows can't express deletions — the row is simply gone. Prefer an API with soft deletes (a deleted_at or a tombstone/changes feed) so you can propagate removals. If none exists, periodically reconcile with a full ID sweep and remove local rows the source no longer returns.

## Make It Resumable and Idempotent
Checkpoint the cursor or watermark after every page so a crash resumes mid-stream, not from zero. Upsert by primary key so reprocessing a page is harmless. Bound page size, honor rate limits with backoff, and retry transient failures on the same cursor.

## When to Skip
A small, bounded, rarely-changing dataset can be fetched in one full pull. The cursor-plus-watermark machinery earns its keep on large or actively-mutating datasets you sync repeatedly.
