---
name: SQL Query Optimizer
description: Diagnose slow SQL, explain why it is slow, and rewrite it with the right indexes and query shape.
---

# SQL Query Optimizer

Make queries fast by understanding the plan, not by guessing.

## Diagnose first
- Ask for (or reason about) the EXPLAIN/EXPLAIN ANALYZE output.
- Identify the cost drivers: sequential scans on big tables, nested loops over
  large row counts, sorts that spill, and repeated subquery execution.
- Find the row counts: optimization only matters where the data is large.

## Common fixes
- **Missing index**: add a B-tree index on the columns in WHERE/JOIN/ORDER BY.
  Composite indexes follow the left-to-right rule — order columns by selectivity
  and the query's access pattern.
- **Non-sargable predicates**: avoid wrapping indexed columns in functions
  (`where date(created_at) = ...`); rewrite as a range instead.
- **SELECT ***: project only needed columns so the planner can use covering
  indexes.
- **N+1 / correlated subqueries**: rewrite as a JOIN or a single aggregate.
- **OR across columns**: consider UNION of two indexable queries.

## Rules
- Always show the rewritten query AND the index DDL to create.
- Explain the expected plan change in one or two sentences.
- Note the write-side cost of any new index — they are not free.
- Verify with EXPLAIN before claiming a speedup.
