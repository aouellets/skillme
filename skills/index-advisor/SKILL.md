---
name: Index Advisor
description: Recommends, orders, and prunes indexes for a specific query or table — composite column order, partial and covering indexes, duplicate/unused cleanup, and write-cost tradeoffs. Use when a query is slow and EXPLAIN shows a Seq Scan or a sort, before adding a CREATE INDEX, or when auditing a table's index set for bloat or duplicates. Do NOT use when the table is too large and needs partitioning or a time-series strategy — use partition-planner instead; do NOT use when the query shape itself is the problem (function-wrapped predicates, leading wildcards, correlated subqueries) — use query-rewriter instead.
---
# Index Advisor
An index trades write speed and disk for read speed. Add the fewest indexes that serve real query shapes, order their columns deliberately, and prove every change with a plan.

## Workflow
1. **Capture evidence first.** Get the actual access path: run `EXPLAIN (ANALYZE, BUFFERS)` on the slow query (Postgres) or `EXPLAIN ANALYZE` / `EXPLAIN FORMAT=JSON` (MySQL). Note the Seq Scan, expensive Sort, or rows-removed-by-filter that an index would eliminate. Never recommend an index without a plan that shows the problem.
2. **Extract the query shape.** Identify the equality predicates (`=`, `IN`), the one range/sort column (`<`, `>`, `BETWEEN`, `ORDER BY`), and the columns the query returns. These three sets drive column order, the range column, and covering decisions respectively.
3. **Order composite columns: equality first, then one range/sort.** Equality columns lead, then a single range or sort column. `(tenant_id, created_at)` serves `WHERE tenant_id = ? ORDER BY created_at`; reversing it does not. By the leftmost-prefix rule, `(a, b, c)` already serves `(a)` and `(a, b)` — so do not also create `(a)`; it is redundant for lookups.
4. **Make it partial when one predicate is always present.** If queries always filter the same constant, scope the index: `CREATE INDEX ON orders (created_at) WHERE status = 'pending'` is tiny and hot. Prefer a partial index over a plain index on a low-cardinality column (boolean, status).
5. **Make it covering when the heap fetch dominates.** To get an index-only scan: in Postgres add `INCLUDE (amount, status)`; in MySQL InnoDB the PK is already appended, so add the covered columns to the index key. Confirm with the plan showing `Index Only Scan` (Postgres) or `Using index` (MySQL).
6. **Prune dead weight.** Find unused indexes via `pg_stat_user_indexes` where `idx_scan = 0` over a representative window. Find duplicates by identical or prefix-redundant column lists and drop the subset. Apply with `CREATE INDEX CONCURRENTLY` / `DROP INDEX CONCURRENTLY` (Postgres) to avoid table locks.
7. **Weigh the write cost before keeping it.** Every index taxes each INSERT/UPDATE/DELETE and bloats the WAL/redo log, and updating an indexed column defeats HOT/in-place updates. On a write-hot table, prefer one well-ordered composite over several single-column indexes.
8. **Verify.** Re-run the plan and confirm the planner uses the new index AND the query is actually faster. If it does not, drop the index.

## Quality bar
- Every recommendation cites the plan line it fixes; no speculative indexes.
- Column order is justified by the equality-then-range rule, not guessed.
- Every drop names the evidence (idx_scan = 0, or the index it duplicates).
- Net index count and write cost are stated, not just the additions.

## Do NOT
- Do NOT index tiny tables (under a few hundred rows) — a Seq Scan beats an index lookup.
- Do NOT index a column only ever used inside a function or with a leading `%` wildcard unless you build the matching expression index — otherwise the planner cannot use it.
- Do NOT create a single-column index whose column is already the leftmost prefix of an existing composite.
- Do NOT add an index without re-running the plan to confirm it is used and faster.
- Do NOT solve a too-large table by indexing — that is partition-planner's job; do NOT rewrite the query shape — that is query-rewriter's job.
