---
name: ClickHouse Analytics
description: Model and query ClickHouse with the right engines, views, and projections.
---

# ClickHouse Analytics

Get fast analytical queries from ClickHouse by modeling for its columnar, sorted storage.

## Choose the right table engine

- MergeTree is the workhorse for analytical tables.
- ReplacingMergeTree deduplicates rows with the same sorting key during background merges (eventual, use FINAL or aggregation to read deduped).
- SummingMergeTree and AggregatingMergeTree pre-aggregate on merge.
- ReplicatedMergeTree variants add replication for production.

## The ORDER BY clause is the index

ClickHouse has no traditional secondary index by default; the sorting key defines the primary index and physical order.

```sql
CREATE TABLE events (
  event_date Date,
  user_id UInt64,
  event_type LowCardinality(String),
  value Float64
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_type, event_date, user_id);
```

Put the columns you filter and group by most, in order of selectivity, into ORDER BY. Queries that filter on a prefix of the sorting key skip irreplevant granules.

## Partitioning

Partition by a coarse column like month. Partitions enable fast `DROP PARTITION` for retention and let queries prune whole partitions. Do not over-partition; too many partitions hurt merges.

## Data types matter

- Use `LowCardinality(String)` for columns with few distinct values; it dictionary-encodes them.
- Use the smallest integer type that fits.
- Prefer `DateTime` over strings for timestamps.

## Materialized views

A materialized view is an insert trigger that writes transformed rows into a target table as data arrives:

```sql
CREATE MATERIALIZED VIEW daily_mv
TO daily_agg AS
SELECT event_date, event_type, count() AS cnt, sum(value) AS total
FROM events GROUP BY event_date, event_type;
```

Combine with an AggregatingMergeTree target and `-State`/`-Merge` combinators to maintain rollups incrementally.

## Projections

Projections store an alternative sort order or pre-aggregation inside the same table; ClickHouse picks the best one per query automatically:

```sql
ALTER TABLE events ADD PROJECTION by_user
( SELECT user_id, count() GROUP BY user_id );
```

## Query tips

- Avoid `SELECT *`; read only needed columns since storage is columnar.
- Filter on sorting-key prefixes to enable granule skipping.
- Use `PREWHERE` for highly selective filters to read fewer columns.
- Inspect plans with `EXPLAIN` and check parts read in the query log.
- Prefer approximate functions like `uniqHLL12` when exactness is not required.
