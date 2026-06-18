---
name: Replication Lag Debugger
description: Diagnoses read-replica lag and the stale-read bugs it causes, and applies read-after-write consistency strategies; use when reads return data older than a just-committed write, or when monitoring shows replica lag growing.
---
# Replication Lag Debugger
A read replica is eventually consistent: a write committed on the primary is not instantly visible on replicas. Most "the data disappeared after I saved it" bugs are reads racing ahead of replication, not data loss.

## Measure the Lag, Not Just the Symptom
In Postgres compare on the primary with pg_current_wal_lsn() against each replica's pg_last_wal_replay_lsn(), and check pg_stat_replication for write/flush/replay LSN gaps and the time-based lag from pg_last_xact_replay_timestamp(). In MySQL read Seconds_Behind_Source from SHOW REPLICA STATUS (treat it as approximate — it stalls to 0 then jumps). Distinguish replay lag (replica busy applying) from network/send lag.

## Find Why It Lags
Single-threaded replay can't keep up with a write-heavy primary — enable parallel apply (MySQL replica_parallel_workers, Postgres has limited parallel recovery). A long-running query on the replica conflicts with WAL replay and pauses it (Postgres hot_standby_feedback / max_standby_streaming_delay tradeoff). A bulk write, backfill migration, or VACUUM on the primary floods the WAL stream — throttle backfills into smaller batches. Network saturation between regions adds send lag.

## Fix Stale Reads With Read-After-Write
The core bug: a request writes to the primary then immediately reads from a replica that hasn't caught up. Strategies, cheapest first: route the same user's reads to the primary for a short window after their write (session stickiness keyed by user). Or read your own writes from the primary always, replicas for other users' data. Or use LSN/GTID tracking — capture the write's LSN, and have the read wait until the chosen replica's replay LSN passes it (Postgres can poll pg_last_wal_replay_lsn; MySQL WAIT_FOR_EXECUTED_GTID_SET).

## Route Reads Deliberately
Never send a read that must reflect a just-made change to a replica by default. Tag queries: strongly-consistent (primary) vs. tolerant-of-staleness (replica). Dashboards, analytics, and lists tolerate seconds of lag; a user re-reading the form they just submitted does not. Build this routing into the data layer, not ad hoc per call site.

## What to Skip
Don't force every read to the primary to dodge lag — that defeats the replica and overloads the primary; scope primary-reads to the read-after-write window. Don't alarm on sub-second lag; set thresholds to your consistency SLA. Don't chase lag spikes that coincide with a known backfill — fix the backfill batching instead.
