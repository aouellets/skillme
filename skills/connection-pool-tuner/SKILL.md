---
name: Connection Pool Tuner
description: Diagnoses connection pool exhaustion and sets correct pool sizes and timeouts across app pools and PgBouncer, including serverless connection storms; use when you see connection-limit errors, checkout timeouts, or idle-connection pile-up.
---
# Connection Pool Tuner
Database connections are expensive and finite. Pool exhaustion shows up as checkout timeouts and "too many clients" errors, and the fix is almost never "raise max_connections."

## Size the Pool to the Database, Not the App
Postgres handles best at a small connection count — each backend is a process with real memory cost. A common ceiling is roughly (core_count * 2) + effective_spindle_count of active connections; most workloads want tens, not thousands. Sum every pool that points at the DB: app replicas * per-replica pool size must stay under max_connections, with headroom for migrations and superuser. Twenty replicas each with a pool of 20 is 400 connections — usually too many.

## Diagnose Exhaustion Precisely
Query pg_stat_activity grouped by state: many `idle in transaction` rows mean code opens a transaction and does slow work (an HTTP call, sleep) before commit — fix the transaction scope, not the pool. Many `active` long-runners mean slow queries; tune those. Checkout timeouts with mostly-idle DB connections mean the app pool is too small or connections leak (not returned to the pool).

## Set Timeouts That Fail Fast
Set a pool checkout/acquire timeout (a few seconds) so a request fails fast instead of piling up. Set idle_in_transaction_session_timeout in Postgres to kill stuck transactions. Set statement_timeout to cap runaway queries. In HikariCP tune connectionTimeout and maxLifetime below the DB/proxy idle cutoff so you don't hand out dead sockets.

## PgBouncer and Serverless Storms
Put PgBouncer in transaction pooling mode in front of Postgres to multiplex many client connections onto few server connections — but transaction mode forbids session-level features (prepared-statement caches, SET, advisory locks held across statements); configure clients accordingly. Serverless/Lambda functions each open their own connection and can storm the DB on a traffic spike — route them through PgBouncer or a serverless driver (Neon/Supabase pooler, RDS Proxy, Prisma Accelerate) and keep per-function pool size at 1.

## Defaults to Reach For
Start small: app pool of 5-10 per replica, a checkout timeout of 2-5s, and a proxy in transaction mode if connection count is the bottleneck. Measure pg_stat_activity under load before raising any number. If raising the pool fixes latency, you had a leak or a slow transaction — find it rather than masking it.
