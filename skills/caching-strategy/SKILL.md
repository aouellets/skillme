---
name: Caching Strategy
description: Design correct multi-layer caching.
---

# Caching Strategy

Add caching where it helps, and keep it correct under invalidation and load.

## Layers

1. Browser/CDN: cache static and cacheable responses near the user.
2. Application: in-memory or Redis for computed results and hot objects.
3. Database: query cache, materialized views, read replicas.

Cache as close to the consumer as correctness allows.

## Patterns

- Cache-aside (lazy): on miss, load from source, store, return. Most common.
- Read-through / write-through: cache sits inline with the store.
- Write-behind: buffer writes, flush async (risk of loss).

```text
get(key):
  v = cache.get(key)
  if v is None:
     v = db.load(key)
     cache.set(key, v, ttl=...)
  return v
```

## Invalidation

- Prefer TTL for data that can be slightly stale.
- Event-based invalidation (delete/update key on write) for must-be-fresh data.
- Version keys (`user:123:v2`) to invalidate whole sets at once.
- Never cache without an expiry escape hatch.

## Stampede prevention

When a hot key expires, many requests rebuild it at once.

- Single-flight lock: only one request recomputes; others wait or serve stale.
- Add random jitter to TTLs so keys don't expire simultaneously.
- Serve-stale-while-revalidate: return the old value and refresh in the background.

## HTTP caching

- `Cache-Control: public, max-age=31536000, immutable` for hashed static assets.
- `ETag`/`If-None-Match` for conditional revalidation of dynamic content.
- `stale-while-revalidate` to hide refresh latency.

## Rules

- Never cache user-specific data in a shared/public cache (auth leak risk).
- Choose a sane eviction policy (LRU/LFU) and size the cache; monitor hit rate.
- Measure: a low hit rate cache just adds latency and complexity.

## Edge cases

- Cache penetration (missing keys queried repeatedly): cache negative results briefly.
- Big-key/hot-key in Redis: shard or replicate the hot value.
- Consistency across nodes: accept eventual consistency or use pub/sub invalidation.
