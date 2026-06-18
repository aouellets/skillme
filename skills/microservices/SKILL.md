---
name: Microservices Design
description: Design service boundaries, communication, and consistency.
---

# Microservices Design

Split a system into services only where the boundaries pay for themselves.

## When (and when not)

- Start with a modular monolith. Extract a service when a module needs independent scaling, deployment, or ownership.
- Premature microservices add network latency, partial failure, and operational overhead for no benefit.

## Defining boundaries

- Align services to business capabilities (bounded contexts), not technical layers.
- A service owns its data exclusively; no other service touches its database.
- Aim for high cohesion inside, loose coupling across. If two services always change together, they're one service.

## Communication

- Synchronous (REST/gRPC) for request/response where the caller needs an immediate answer.
- Asynchronous (events/queues) for workflows and to decouple — prefer this for resilience.
- Define contracts explicitly (OpenAPI/protobuf/AsyncAPI) and version them.

```text
Order Service --(OrderPlaced event)--> Inventory Service
                                   --> Notification Service
```

## Data consistency

- You can't have distributed transactions cheaply — use the Saga pattern with compensating actions.
- Use the Outbox pattern to publish events atomically with the local DB write.
- Embrace eventual consistency; design UIs to tolerate it.
- Make consumers idempotent; deduplicate by event id.

## Resilience

- Timeouts on every remote call; never wait indefinitely.
- Circuit breakers to stop hammering a failing dependency.
- Retries with backoff + jitter for transient errors only.
- Bulkheads: isolate resource pools so one slow dependency doesn't exhaust threads.

## Rules

- No shared database. Shared DB = distributed monolith.
- Propagate a correlation/trace id across every hop.
- Keep services independently deployable; backward-compatible contract changes only.

## Edge cases

- Read-heavy cross-service views: build a read model (CQRS) fed by events rather than synchronous fan-out.
- Schema evolution: additive, tolerant readers; never break existing event consumers.
- Service discovery and config: externalize; don't hardcode endpoints.
