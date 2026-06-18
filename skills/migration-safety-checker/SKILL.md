---
name: Migration Safety Checker
description: Flags schema migrations that take blocking locks or run long, and rewrites them into zero-downtime steps — nullable-add-then-backfill, concurrent index builds, and expand-contract; use before running any ALTER TABLE or migration against a live production database.
---
# Migration Safety Checker
A migration that is correct in a test DB can take a production-halting lock on a large hot table. Safety is about which lock a statement takes and how long it holds it while other queries queue behind it.

## Know Which Statements Take Heavy Locks
In Postgres, ACCESS EXCLUSIVE locks (which block reads and writes) are taken by adding a column with a volatile default on old versions, changing a column type, adding a non-concurrent index, and many constraint additions. A dangerous trap: a long-running ALTER waiting for its lock blocks every query that arrives after it, even fast SELECTs — the queue, not the ALTER itself, causes the outage. Always set a lock_timeout (a few seconds) before DDL so a blocked migration aborts instead of stalling traffic.

## Add Columns the Safe Way
Add a column NULLable with no volatile default (instant in modern Postgres). Backfill in batches (UPDATE ... WHERE id BETWEEN ranges, committing each batch) to avoid one giant transaction and bloat. Only then add the NOT NULL — and do it via a CHECK constraint validated with NOT VALID then VALIDATE CONSTRAINT, which takes a weaker lock than a direct SET NOT NULL.

## Build Indexes and Constraints Without Blocking
Use CREATE INDEX CONCURRENTLY (it can't run inside a transaction, so disable the migration's transaction wrapper — disable_ddl_transaction! in Rails). Add foreign keys and check constraints as NOT VALID first (fast, takes a light lock), then VALIDATE CONSTRAINT in a separate step (scans without blocking writes). Drop indexes with DROP INDEX CONCURRENTLY.

## Use Expand-Contract for Renames and Type Changes
Never rename a column or change its type in one deploy — the old code still references the old shape. Expand: add the new column/table, dual-write from the app, backfill. Migrate reads to the new column. Contract: stop writing the old column, then drop it in a later deploy. Each step is independently deployable and reversible.

## What to Skip
On a small table (thousands of rows) a brief ACCESS EXCLUSIVE lock is invisible — don't add expand-contract ceremony there. Concurrent index builds are slower and can fail leaving an INVALID index (drop and retry); plain CREATE INDEX is fine in a maintenance window. Match the rigor to the table's size and write traffic, and always verify the actual lock with a tool like the pg-osc or a lock-impact linter before production.
