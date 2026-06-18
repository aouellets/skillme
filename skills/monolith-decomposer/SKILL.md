---
name: Monolith Decomposer
description: Identifies bounded-context seams for extracting a service from a monolith, analyzing dependencies, data ownership, and anti-corruption layers, then sequences the extraction. Use when planning to carve a service out of a monolith or evaluating whether a seam is ready to extract.
---
# Monolith Decomposer
Extracting a service is easy to start and ruinous to get wrong: cut along the wrong seam and you get a distributed monolith — all the network latency of microservices with all the coupling of a monolith. Find the real bounded context first; data ownership decides everything.

## Find Seams by Bounded Context, Not Org Chart
The right seam is a bounded context: a cluster of behavior with high internal cohesion and a thin, stable interface to the rest. Identify it from the domain (DDD bounded contexts, aggregates) and confirm with evidence — call-graph and module-coupling analysis (madge, structure101, dependency cruisers), commit co-change patterns (files that always change together belong together), and transaction boundaries. A good seam has few inbound call sites and a small shared vocabulary.

## Let Data Ownership Be the Veto
A service that doesn't own its data isn't a service. The hardest part of decomposition is splitting the database, not the code. For your candidate, map every table it reads and writes and who else touches them. If the new service and the monolith both need write access to the same tables in one transaction, the seam is wrong or not ready. Plan the data split: which tables move, how to break foreign keys across the boundary, and how to handle the queries that joined across it.

## Insert an Anti-Corruption Layer
Don't let the monolith's models leak into the new service. Put an anti-corruption layer (a translation facade) at the boundary so the extracted service speaks its own clean domain language and the monolith keeps its own. This lets you fix the model in the new service without a coordinated big-bang change and protects each side from the other's churn.

## Sequence: Seam, Then Move, Then Cut
Extract incrementally, strangler-style. First create the seam in-process (a clear interface/module boundary inside the monolith) and prove all callers go through it. Then move the implementation behind a network call while keeping the old path behind a flag. Migrate data with dual-write or CDC and reconcile. Only cut the in-monolith code once the service has served real traffic through a full cycle.

## Plan for Distribution's New Failure Modes
A local call that never failed is now a network call that times out, retries, and partially fails. Decide consistency per operation: can it be eventually consistent, or did you just split a transaction that must be atomic? Add idempotency, timeouts, and circuit breakers at the boundary, and observability that traces a request across the seam. If an operation truly needs cross-service ACID, the seam is in the wrong place.

## When Not to Extract
If the monolith's real problem is deploy speed, test flakiness, or unclear modules, fix those in-process first — modularize before you distribute. Don't extract for resume-driven reasons. A well-modularized monolith beats a badly-cut set of services on almost every axis; only extract when independent scaling, deployment, or team ownership genuinely demands it.
