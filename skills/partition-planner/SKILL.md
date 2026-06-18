---
name: Table Partition Planner
description: Designs partitioning and sharding for a large table — range, list, or hash strategy, partition key choice, and the operational pitfalls — and decides when not to partition at all; use when a single table is too large to manage, vacuum, or query efficiently.
---
# Table Partition Planner
Partitioning splits one logical table into physical children to make pruning, vacuum, and data lifecycle cheaper. It helps only when queries and retention align with the partition key — otherwise it adds pain without benefit.

## Pick the Strategy From the Access Pattern
Range partitioning fits time-series and anything with a natural ordered key — partition orders by created_at month so old data drops with DROP/DETACH PARTITION instead of a giant DELETE. List partitioning fits a small fixed set of discrete values like region or tenant tier. Hash partitioning spreads writes evenly when there is no natural range and you want to cap any single child's size — use a fixed modulus.

## Choose the Key the Queries Use
The partition key must appear in the WHERE clause of hot queries, or the planner can't prune and scans every child. The key should also align with your retention policy (drop by time) and your largest indexes. A key that is in the query but high-churn for updates can force expensive row movement between partitions — avoid partitioning on a frequently mutated column.

## Mind the Pitfalls
Unique constraints and primary keys must include the partition key in Postgres declarative partitioning — plan composite keys accordingly. Cross-partition queries that don't filter on the key fan out to all children. Too many partitions (thousands) bloats planning time; keep counts reasonable and automate creation with pg_partman or a scheduled job so you never write into a missing partition. Foreign keys referencing a partitioned table have version-specific limits.

## Sharding Is a Bigger Hammer
Partitioning stays on one node; sharding spreads across nodes (Citus, Vitess, app-level routing) and adds distributed-transaction and rebalancing complexity. Reach for it only when one node's write throughput or storage is the hard ceiling. Pick a shard key with even distribution and no cross-shard joins on the hot path.

## When NOT to Partition
Under roughly 50-100M rows or a few hundred GB, a well-indexed single table usually outperforms a partitioned one — partition pruning overhead and planning cost aren't worth it. Don't partition to fix a missing index; add the index first. If no single column appears in most WHERE clauses and your retention is not time-based, partitioning will mostly hurt.
