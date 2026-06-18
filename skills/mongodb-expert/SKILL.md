---
name: MongoDB Expert
description: Design MongoDB schemas, indexes, and aggregation pipelines that perform.
---

# MongoDB Expert

Model data, index it, and query it the MongoDB way.

## Schema design: model for your queries

Unlike relational design, model around access patterns, not normalization.

- Embed when data is accessed together and the child is bounded (e.g. order line items inside an order).
- Reference when data is large, unbounded, or shared (e.g. users referenced by many orders).
- Watch the 16 MB document limit; unbounded arrays are an anti-pattern. Use the subset or bucket pattern for growing collections of children.

## Indexing

Indexes are the single biggest performance lever.

```js
db.orders.createIndex({ customerId: 1, createdAt: -1 })
```

Follow the ESR rule for compound indexes: Equality fields first, then Sort fields, then Range fields. A query filtering on customerId, sorting by createdAt is served fully by the index above.

- Use `explain("executionStats")` and confirm an IXSCAN, not a COLLSCAN.
- Create partial indexes to index only relevant documents.
- Use covered queries (projection limited to indexed fields) to avoid fetching documents.
- Avoid too many indexes; each one slows writes.

## Aggregation pipeline

Build pipelines that filter early to shrink the working set:

```js
db.orders.aggregate([
  { $match: { status: "shipped", createdAt: { $gte: start } } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" }, n: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 100 }
])
```

- Place `$match` and `$project` as early as possible so indexes apply and less data flows downstream.
- `$lookup` performs a join; index the foreign field.
- Use `$facet` for multiple aggregations in one pass.
- Beware pipeline memory limits; allow `{ allowDiskUse: true }` for large groupings.

## Change streams

React to data changes in real time:

```js
const stream = db.collection("orders").watch([
  { $match: { operationType: "insert" } }
])
for await (const change of stream) { handle(change.fullDocument) }
```

Resume after failures with a stored resume token. Change streams require a replica set.

## Operational best practices

- Use a replica set for durability; set an appropriate write concern (`w: "majority"`).
- Choose read concern based on consistency needs.
- Shard on a high-cardinality key that distributes writes evenly; avoid monotonically increasing shard keys.
- Monitor slow queries with the database profiler.
- Use transactions only when truly needed; single-document operations are already atomic.
