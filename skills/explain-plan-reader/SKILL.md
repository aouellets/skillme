---
name: EXPLAIN Plan Reader
description: Interprets Postgres and MySQL EXPLAIN ANALYZE output to pinpoint the bottleneck node — seq scans, bad row estimates, expensive sorts and joins — and prescribes a fix for each; use when a query is slow and you have or can capture its execution plan.
---
# EXPLAIN Plan Reader
A query plan is a tree executed bottom-up and inside-out. Reading it is about finding the one node where time or rows explode, not auditing every line.

## Capture the Right Plan
Use EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) in Postgres — ANALYZE runs the query and gives real timings, BUFFERS reveals cache vs disk reads. In MySQL 8 use EXPLAIN ANALYZE. Plain EXPLAIN only shows estimates and lies under skew. Run twice: the first run may be cold cache.

## Find the Bottleneck Node
In Postgres text plans, compare `actual time` between a node and its children — the node's own cost is the delta. Look for the deepest node with the largest `actual time` or `loops` count. `(actual rows=... loops=N)` means the node ran N times; multiply to get true work. A Nested Loop with high loops over a Seq Scan is a classic disaster.

## Diagnose by Node Type
Seq Scan on a large table filtered to few rows: missing or unusable index — add one, or check the WHERE wraps the column in a function defeating the index. Bad row estimate (estimated 1, actual 500000): stale statistics — run ANALYZE the_table, or raise `default_statistics_target` for skewed columns. External merge Sort or Disk-spilling sort: raise work_mem or add an index providing pre-sorted order. Hash Join spilling to disk (Batches > 1): raise work_mem. Nested Loop chosen for a large set: usually a row underestimate upstream — fix the estimate and the planner picks Hash/Merge Join.

## Read MySQL Differently
MySQL plans surface `type` (ALL = full scan, ref/eq_ref = index lookup, range = index range), `rows` examined, and `Extra` (Using filesort, Using temporary are red flags). EXPLAIN ANALYZE shows actual loops and time like Postgres. `Using filesort` plus a large rows count means an unindexed ORDER BY.

## What to Skip
Ignore cheap nodes even if they look scary by name — a Seq Scan on a 50-row lookup table is correct and fast. Don't tune nodes consuming under a few percent of total time. Cost units are not milliseconds; trust `actual time`, never the estimated `cost=` numbers, once ANALYZE is available.
