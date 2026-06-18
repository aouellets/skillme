---
name: SQL Query Rewriter
description: Refactors slow SQL into efficient equivalents — correlated subqueries to joins, accidental cross joins, OR conditions to UNION, SELECT * to explicit columns, and OFFSET pagination to keyset; use when a query is structurally inefficient regardless of indexing.
---
# SQL Query Rewriter
Some queries are slow because of their shape, not their indexes. Rewriting the shape can beat any amount of tuning — but every rewrite must return identical results.

## Correlated Subquery to Join or Lateral
A subquery in SELECT or WHERE that references the outer row runs once per outer row. Rewrite a correlated scalar subquery as a JOIN to a grouped derived table, or in Postgres a LATERAL join when you need per-row top-N. Replace WHERE EXISTS chains with a single JOIN where multiplicity allows, or keep EXISTS over IN when the inner set is large (EXISTS short-circuits, NOT IN breaks on NULLs).

## Kill Accidental Cross Joins
A query listing N tables in FROM with a missing or incomplete join predicate produces a Cartesian product — row counts multiply and explode. Always write explicit JOIN ... ON conditions, one per table relationship. If EXPLAIN shows actual rows far larger than any single table, suspect a missing ON clause.

## OR to UNION and IN
An OR across two different columns often can't use either index: WHERE a = 1 OR b = 2 may seq scan. Rewrite as UNION of two index-friendly queries (UNION ALL plus dedup if needed). An OR on the same column becomes IN (...). A leading-wildcard LIKE '%x' can't use a B-tree at all — consider a trigram (pg_trgm) GIN index instead.

## SELECT * and OFFSET Pagination
Replace SELECT * with the exact columns needed — it shrinks I/O and enables index-only scans. Replace OFFSET 100000 LIMIT 20 (which scans and discards 100k rows and gets slower per page) with keyset pagination: WHERE (created_at, id) < (:last_ts, :last_id) ORDER BY created_at DESC, id DESC LIMIT 20, backed by a matching composite index.

## What to Skip
Don't rewrite a query the planner already optimizes well — modern Postgres unnests many subqueries itself; check EXPLAIN before refactoring. Keep OFFSET for small, bounded result sets where a jump-to-page-N UI is required. Never trade correctness for speed: re-run both versions against the same data and diff the output before shipping.
