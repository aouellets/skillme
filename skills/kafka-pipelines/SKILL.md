---
name: Kafka Pipelines
description: Design Kafka topics, consumer groups, offsets, and dead-letter handling.
---

# Kafka Pipelines

Design reliable streaming pipelines with Apache Kafka.

## Topic design

- Partition count sets the maximum consumer parallelism in a group; choose for peak throughput and future growth, since increasing partitions later rehashes keys.
- The partition key determines ordering. Records with the same key go to the same partition and preserve order. Pick a key that both balances load and groups what must stay ordered (e.g. `customerId`).
- Set retention by time or size based on replay needs. Use log compaction for changelog-style topics keyed by entity.
- Set replication factor to at least 3 in production and `min.insync.replicas=2`.

## Producers

```properties
acks=all
enable.idempotence=true
max.in.flight.requests.per.connection=5
compression.type=zstd
```

Idempotent producers with `acks=all` give exactly-once delivery to a partition and prevent duplicates from retries. Batch with `linger.ms` and `batch.size` for throughput.

## Consumer groups and offsets

- All consumers in a group share the partitions; each partition is consumed by exactly one member.
- Disable auto-commit and commit offsets only after successful processing to get at-least-once semantics:

```java
props.put("enable.auto.commit", "false");
// process records, then:
consumer.commitSync();
```

- Commit after processing, not before, or you will lose records on a crash.
- Tune `max.poll.records` and `max.poll.interval.ms` so processing finishes before the consumer is considered dead and a rebalance kicks in.

## Dead-letter queues

When a record cannot be processed after retries, route it to a dead-letter topic rather than blocking the partition:

```
orders -> [process] --fail--> orders.DLQ (with headers: error, original-offset, timestamp)
```

- Add headers capturing the exception, source topic, partition, and offset for debugging.
- Apply bounded retries with backoff before sending to the DLQ.
- Monitor DLQ depth and build tooling to inspect and replay messages.

## Exactly-once processing

For read-process-write within Kafka, use transactions to commit offsets and output atomically, or use Kafka Streams which manages this for you.

## Operational best practices

- Monitor consumer lag per partition; rising lag signals undersized consumers.
- Use a schema registry (Avro or Protobuf) to enforce compatibility and evolve schemas safely.
- Plan for rebalances: make processing idempotent so reprocessing is safe.
- Size partitions and brokers with headroom; rebalancing a hot cluster is risky.
