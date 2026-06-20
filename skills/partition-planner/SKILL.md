---
name: Table Partition Planner
description: Produces a partitioning or sharding plan for an oversized table — range/list/hash strategy, partition-key choice, composite-key and pruning constraints, and a verdict on whether to partition at all. Use when one table has grown past tens of millions of rows or hundreds of GB, vacuum/autovacuum on it runs for hours, retention deletes are giant DELETEs, or you are deciding between range/list/hash partitioning or sharding a hot table. Do NOT use when the goal is choosing indexes for specific slow queries — use index-advisor instead.
---
# Table Partition Planner

Plan how to split one too-large table into partitions (or shards) keyed to its real access and retention patterns — or prove it should stay a single indexed table.

## Workflow

1. **Confirm partitioning is warranted.** Get the row count and on-disk size. Below roughly 50-100M rows or a few hundred GB, a well-indexed single table usually beats a partitioned one; recommend staying single unless retention or vacuum pain forces the issue. Never partition to compensate for a missing index — that is index-advisor's job; add the index first and re-measure.
2. **Characterize the access pattern.** Capture the hot queries' WHERE clauses, the retention/deletion policy, and write distribution. The partition key must come from this evidence, not a guess.
3. **Pick the strategy from that pattern.**
   - **Range** — time-series or any naturally ordered key (e.g. `created_at` by month). Old data leaves via `DROP`/`DETACH PARTITION` instead of a giant `DELETE`.
   - **List** — a small fixed set of discrete values (region, tenant tier).
   - **Hash** — no natural range but you must cap any single child's size; use a fixed modulus to spread writes evenly.
4. **Choose the partition key.** It must appear in the WHERE clause of hot queries (or the planner cannot prune and scans every child), align with the retention policy (drop by time), and align with the largest indexes. Reject any column that is frequently updated — moving a row across partitions on UPDATE is expensive.
5. **Resolve the constraint and operational requirements.**
   - In Postgres declarative partitioning, every unique constraint and primary key must include the partition key — design composite keys accordingly.
   - Automate partition creation (pg_partman or a scheduled job) so writes never hit a missing partition.
   - Keep partition count bounded (low hundreds, not thousands) to avoid planning bloat.
   - Verify foreign-key behavior against your engine version's partitioning limits.
6. **Decide partition vs shard.** Partitioning stays on one node. Reach for sharding (Citus, Vitess, or app-level routing) only when a single node's write throughput or storage is the hard ceiling — it adds distributed-transaction and rebalancing cost. If sharding, pick a shard key with even distribution and no cross-shard joins on the hot path.
7. **Write the plan.** State chosen strategy, key, composite-key changes, creation/automation mechanism, retention operation, and the migration approach to convert the existing table.

## Quality bar

- The recommendation is backed by an actual row count and size measurement, not an estimate.
- The partition key provably appears in the hot queries' WHERE clauses and matches the retention policy.
- "Do not partition" is a valid, expected outcome and must be stated plainly when the evidence supports it.
- Every Postgres unique/primary key in the plan includes the partition key.

## Do NOT

- Do not partition a table that is small or merely missing an index.
- Do not choose a partition key absent from hot queries' WHERE clauses — it kills pruning.
- Do not partition on a high-churn updated column — it forces cross-partition row movement.
- Do not create thousands of partitions; planning time degrades.
- Do not leave partition creation manual — a missing future partition rejects writes.
- Do not jump to sharding before single-node partitioning is exhausted.
- Do not prescribe per-query index sets here — defer that to index-advisor.
