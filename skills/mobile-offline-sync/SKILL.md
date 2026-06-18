---
name: Mobile Offline Sync
description: Implements local-first storage with background sync, conflict resolution, queueing, and retry on mobile. Use when building offline-capable features, sync engines, or reconciling local and server state.
---
# Mobile Offline Sync
Local-first means the local store (Room, SwiftData, SQLite, Realm) is the source of truth the UI reads and writes; the network is an eventual replication detail. The hard part is never the happy path — it is reconciling divergent edits made while offline.

## The Store Is the UI's Truth
Writes go to the local database synchronously and the UI reflects them immediately (optimistic). A separate sync layer observes pending changes and pushes them. Never block the UI on a network round-trip. Mark every row with a sync state: pending, syncing, synced, failed — the UI can then show subtle pending indicators.

## Queue Mutations, Don't Replay Raw Requests
Model each offline change as an intent in a durable outbox table (create/update/delete with entity id, fields, client timestamp, and a client-generated UUID for idempotency). Send the queue in order; the server dedupes on the UUID so a retried request never double-applies. Replaying raw HTTP requests loses ordering and idempotency.

## Choose Conflict Resolution Deliberately
Last-write-wins (compare timestamps or version vectors) is simple and acceptable for whole-object, single-owner data — but a stale device clock silently destroys data, so prefer server-assigned versions or a hybrid logical clock. Field-level merge keeps concurrent edits to different fields. For collaborative text or sets, use CRDTs. Decide per entity and write it down; there is no universal default.

## Pull, Detect, Reconcile
Sync incrementally with a server cursor or updated_since watermark, not full table scans. On pull, detect conflicts by comparing the base version the client last saw against the server's current version. Apply your resolution rule, then write the reconciled result back locally and clear the pending flag. Keep tombstones for deletes so a deletion is not resurrected by a stale upsert.

## Retry Like the Network Is Hostile
Retry with exponential backoff and jitter; cap attempts and surface persistent failures. Schedule background sync with WorkManager (Android) or BGTaskScheduler (iOS) under OS constraints — you do not control when it runs. Make every sync operation idempotent so a kill mid-flight is safe to repeat.

## When Not to Build This
If the feature needs strong consistency (payments, inventory counts), do not fake it offline — disable the action when offline and say so. Full offline sync is expensive; build it only where the UX truly demands working on a plane.
