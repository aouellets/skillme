---
name: Database Schema Designer
description: Design normalized, indexed, migration-friendly relational schemas.
---

# Database Schema Designer

Design schemas that stay correct and fast as data grows.

## Process

1. Model the entities and relationships before touching DDL.
2. Normalize to 3NF, then denormalize deliberately for proven read hotspots.
3. Choose primary keys; pick indexes from real query patterns.
4. Add constraints to make invalid states unrepresentable.
5. Write forward and rollback migrations.

## Keys and types

- Prefer `BIGINT` identity or UUIDv7 for primary keys. Avoid UUIDv4 as a clustered key — random inserts fragment the index.
- Use the narrowest correct type. `TIMESTAMPTZ` for time, never naive local time.
- Store money as `NUMERIC(19,4)`, never float.
- Use enums or a lookup table for fixed value sets.

## Constraints

```sql
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status      TEXT NOT NULL CHECK (status IN ('pending','paid','shipped')),
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
```

## Indexing rules

- Index foreign keys you join or filter on.
- Composite index column order: equality columns first, then range/sort columns.
- A covering index can serve a query from the index alone — include selected columns.
- Add a partial index for skewed predicates: `WHERE status = 'pending'`.
- Every index slows writes; remove unused ones (check `pg_stat_user_indexes`).

## Migrations

- One logical change per migration; always reversible.
- For large tables, add columns nullable first, backfill in batches, then add the NOT NULL constraint.
- Create indexes `CONCURRENTLY` to avoid locking writes.
- Never rename and reuse a column in the same deploy as code that reads it — split into two deploys.

## Edge cases

- Soft deletes: add `deleted_at` and filter; remember unique constraints must include it or use a partial unique index.
- Many-to-many: a join table with a composite PK on both FKs.
- Multi-tenancy: include `tenant_id` in every index prefix and unique key.
