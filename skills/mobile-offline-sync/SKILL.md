---
name: Mobile Offline Sync
description: Build local-first mobile storage with an optimistic local store, durable mutation outbox, deliberate conflict resolution, incremental pull, and idempotent background retry. Use when a mobile feature must keep working offline, when edits made offline must reconcile with the server later, or when reconciling a local database (Room, SwiftData, SQLite, Realm) against server state. Do NOT use for simple response caching of read-only data or for strong-consistency operations like payments and inventory counts — disable those offline instead.
---
# Mobile Offline Sync

Make the local store the source of truth the UI reads and writes, and treat the network as eventual replication. The hard part is never the happy path — it is reconciling divergent edits made while offline.

## Workflow

1. **Make the local store the UI's truth.** Write to the local database (Room, SwiftData, SQLite, Realm) synchronously and reflect it in the UI immediately (optimistic). Never block the UI on a network round-trip. Tag every row with a sync state — `pending`, `syncing`, `synced`, `failed` — so the UI can show subtle pending indicators and surface failures.

2. **Queue mutations as intents, not raw requests.** Record each offline change in a durable outbox table: operation (create/update/delete), entity id, changed fields, client timestamp, the base version the client last saw, and a client-generated UUID. Send the outbox in order. The server dedupes on the UUID so a retried request never double-applies.

3. **Choose a conflict-resolution rule per entity and write it down.** Pick deliberately — there is no universal default:
   - Last-write-wins for whole-object, single-owner data. Compare server-assigned versions or a hybrid logical clock, not raw device clocks.
   - Field-level merge when concurrent edits touch different fields of the same record.
   - CRDTs for collaborative text or sets.

4. **Pull, detect, reconcile.** Pull incrementally with a server cursor or `updated_since` watermark — never full table scans. Detect a conflict by comparing the base version the client last saw against the server's current version. Apply the entity's resolution rule, write the reconciled result back locally, and clear the pending flag. Keep tombstones for deletes so a deletion is not resurrected by a stale upsert.

5. **Retry as if the network is hostile.** Retry with exponential backoff plus jitter, cap attempts, and surface persistent failures to the user. Schedule background sync with WorkManager (Android) or BGTaskScheduler (iOS) under OS constraints — you do not control when it runs. Make every sync operation idempotent so a process kill mid-flight is safe to repeat.

## Quality bar

- The UI never waits on the network for a write; every local write is visible instantly.
- Every mutation carries a client-generated UUID and base version; replaying the entire outbox produces the same server state every time.
- Each entity has a documented conflict-resolution rule, and no rule trusts the device clock for correctness.
- Deletes leave tombstones; a stale upsert cannot resurrect a deleted row.
- Killing the app mid-sync and relaunching converges to a consistent state with no duplicates and no lost edits.

## Do NOT

- Do NOT replay raw HTTP requests from a log — that loses ordering and idempotency. Queue intents in an outbox instead.
- Do NOT decide conflicts by comparing raw device clocks; a skewed clock silently destroys data. Use server-assigned versions or a hybrid logical clock.
- Do NOT pull full tables on every sync; use a cursor or watermark.
- Do NOT hard-delete rows without a tombstone.
- Do NOT fake offline support for strong-consistency operations (payments, inventory counts). Disable the action while offline and tell the user why.
- Do NOT build full offline sync where the UX does not demand it — it is expensive; reserve it for features that must work with no connection.
