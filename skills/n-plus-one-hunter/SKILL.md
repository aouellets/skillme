---
name: N+1 Query Hunter
description: Finds and eliminates N+1 query patterns in ORM code (ActiveRecord, Prisma, SQLAlchemy, Hibernate) using eager loading, with judgment on when N+1 is acceptable; use when a request issues many similar queries, a list endpoint is slow, or query logs show repeated SELECTs in a loop.
---
# N+1 Query Hunter
An N+1 is one query to fetch a list, then one more query per row to fetch its association. It is the single most common ORM performance bug and it hides because each query is individually fast.

## Detect It First, Don't Guess
Turn on query logging and count. In Rails, watch the log or use the `bullet` gem. In SQLAlchemy, set `echo=True` or `create_engine(..., echo='debug')`. In Prisma, enable the `query` log event. In Hibernate, set `hibernate.show_sql=true` and `generate_statistics=true`. The tell is a burst of near-identical SELECTs differing only in the WHERE id = ? value, scaling with collection size. pg_stat_statements with a normalized query showing a huge `calls` count confirms it server-side.

## Fix With Eager Loading
Replace lazy per-row loads with a batched preload. ActiveRecord: `Post.includes(:author, comments: :user)` — use `preload` to force separate batched queries, `eager_load` to force a LEFT JOIN, `includes` to let Rails choose. SQLAlchemy: `selectinload(Post.comments)` (issues a second IN query, best default) or `joinedload` for one-to-one. Prisma: pass `include` or `select` with nested relations in one call. Hibernate: use `JOIN FETCH` in JPQL or an `@EntityGraph`, never rely on `FetchType.EAGER` globally.

## Beware Eager-Loading Traps
`joinedload`/`eager_load` on a one-to-many multiplies rows (cartesian fan-out) and can be slower than the N+1 it replaced — prefer `selectinload`/`preload` for collections. Eager loading inside a method called in a loop just moves the N+1 up a level. Counts don't need rows: use `counter_cache` or a grouped `COUNT` instead of loading children to call `.size`.

## When N+1 Is Actually Fine
If N is bounded and small (a detail page loading 3 associations), the batched query and the N+1 are both trivial — don't add complexity. If the per-row query hits a cache (identity map, Redis) the marginal cost may be near zero. Optimize the N+1 that scales with user-controlled input or appears on a hot path, measured at p95.

## What to Skip
Don't preload associations a response never serializes — that is a reverse-N+1 fetching unused data. Don't chase a 2-query "N+1" on a page rendered once a day. Fix the ones that show up in slow traces and grow with data volume.
