---
name: Index Advisor
description: Recommends, orders, and removes indexes for a given slow query and schema — composite column order, partial and covering indexes, duplicate and unused index cleanup, and write-cost tradeoffs; use when a query needs an index, or when auditing a table's index set for bloat.
---
# Index Advisor
An index trades write speed and disk for read speed. Add the fewest indexes that serve real query shapes, and order their columns deliberately.

## Order Composite Columns by Selectivity and Use
Follow the equality-then-range rule: columns used with `=` come first, then one range/sort column. An index on (tenant_id, created_at) serves WHERE tenant_id = ? ORDER BY created_at; reversing it does not. The leftmost-prefix rule means (a, b, c) also serves queries on (a) and (a, b) but never on (b) alone. Don't create (a) separately if (a, b) exists — it is redundant for lookups.

## Use Partial and Covering Indexes
Partial index when queries always filter the same predicate: CREATE INDEX ON orders (created_at) WHERE status = 'pending' is tiny and hot. Covering / index-only scans avoid the heap: in Postgres add INCLUDE (amount, status) so the index answers the query without touching the table; in MySQL InnoDB the PK is always included, so put covered columns in the index. Verify with EXPLAIN showing Index Only Scan.

## Find and Drop Dead Weight
Unused indexes: in Postgres query pg_stat_user_indexes for idx_scan = 0 over a representative window. Duplicate indexes: identical or prefix-redundant column lists — drop the subset. Every extra index slows INSERT/UPDATE/DELETE and bloats WAL. Drop with CREATE/DROP INDEX CONCURRENTLY in Postgres to avoid locking.

## Weigh the Write Cost
A table with heavy write traffic pays per index on every mutation, and HOT updates are defeated when an indexed column changes. On a write-hot table, prefer one well-ordered composite over five single-column indexes. High-cardinality columns index well; a boolean or low-cardinality status rarely benefits from a plain index (use a partial index instead).

## What to Skip
Don't index tiny tables — a seq scan beats an index lookup under a few hundred rows. Don't index columns only ever wrapped in functions unless you build a matching expression index. Don't add an index speculatively; confirm with EXPLAIN ANALYZE that the planner uses it and the query gets faster before keeping it.
