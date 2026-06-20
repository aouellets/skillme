---
name: SQL Query Rewriter
description: Rewrites a structurally inefficient SQL query into a faster equivalent that returns byte-identical results — correlated subqueries to joins or LATERAL, accidental cross joins to explicit ON predicates, OR-across-columns to UNION, SELECT * to projected columns, and deep OFFSET pagination to keyset. Use when a query is slow because of its shape rather than its indexes — EXPLAIN shows a Cartesian blowup, a per-row subquery, or OFFSET discarding tens of thousands of rows — and the indexes are already in place. Do NOT use when the fix is adding or reordering an index — use index-advisor instead; do NOT use to diagnose an unknown slow query from its plan — use sql-query-optimizer instead.
---
# SQL Query Rewriter

Reshape a slow query into a faster equivalent that returns identical rows. Shape beats tuning when the query does avoidable work; this skill owns the structural rewrite only — leave index choice to index-advisor and plan diagnosis to sql-query-optimizer.

## Workflow

1. **Confirm the shape is the problem.** Read the EXPLAIN (ANALYZE if available). Only rewrite if the plan shows a structural cost driver: actual rows far exceeding any single table (Cartesian product), a subquery re-executed per outer row, a Sort/Limit after scanning a huge OFFSET, or an OR that forces a seq scan. If the plan is already optimal, stop — modern Postgres unnests many subqueries itself.
2. **Fix accidental cross joins first.** A FROM listing N tables with a missing or incomplete join predicate multiplies row counts. Write one explicit `JOIN ... ON` per table relationship. If actual rows dwarf every source table, suspect a dropped ON clause.
3. **Decorrelate per-row subqueries.** A scalar subquery in SELECT/WHERE that references the outer row runs once per row. Rewrite it as a JOIN to a grouped derived table; in Postgres use a `LATERAL` join for per-row top-N. Replace `WHERE EXISTS` chains with a single JOIN where multiplicity allows. Keep `EXISTS` over `IN` when the inner set is large — EXISTS short-circuits and `NOT IN` returns wrong results on NULLs.
4. **Split OR across different columns.** `WHERE a = 1 OR b = 2` can use neither column cleanly. Rewrite as `UNION` of two single-predicate queries (`UNION ALL` plus dedup only if duplicates are possible). An OR on the *same* column collapses to `IN (...)`.
5. **Project explicit columns.** Replace `SELECT *` with the exact columns the caller uses. This shrinks I/O and lets an existing covering index answer the query without a heap fetch.
6. **Convert deep OFFSET to keyset pagination.** `OFFSET 100000 LIMIT 20` scans and throws away 100k rows and degrades per page. Rewrite as keyset: `WHERE (created_at, id) < (:last_ts, :last_id) ORDER BY created_at DESC, id DESC LIMIT 20`. Keep OFFSET only for small, bounded sets where a jump-to-page-N UI is required.
7. **Prove equivalence.** Run the original and the rewrite against the same data and diff the full output, including ordering and row count. Re-check EXPLAIN to confirm the structural cost driver is gone.

## Quality bar

- Output is byte-identical to the original on the same data — same rows, same order, same NULL handling.
- Every rewrite removes a cost driver visible in EXPLAIN, not a suspected one.
- The rewrite is justified by the plan, not by folklore; if EXPLAIN does not change, the rewrite is not done.

## Do NOT

- Do not recommend creating or reordering an index — that is index-advisor's job. State that a rewrite assumes the supporting index exists, and hand off if it does not.
- Do not rewrite a query the planner already optimizes; check EXPLAIN before refactoring.
- Do not trade correctness for speed — never ship a rewrite whose output you have not diffed against the original.
- Do not use `NOT IN` with a subquery that can yield NULLs; use `NOT EXISTS`.
