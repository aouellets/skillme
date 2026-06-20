---
name: Monolith Decomposer
description: Finds and sequences one bounded-context seam to extract from a monolith, gated on dependency, data-ownership, and transaction-boundary evidence, and produces an incremental strangler extraction plan. Use when you are planning to carve a service out of a monolith, deciding where to cut, or evaluating whether a candidate seam is ready to extract.
---
# Monolith Decomposer

Extract one bounded-context seam at a time, only after data ownership and evidence prove the cut is clean. Cut along the wrong seam and you get a distributed monolith: the latency of microservices with the coupling of a monolith.

Do NOT use when the task is to capture the implicit business rules and edge cases living inside the code you are about to move — use business-rule-extractor instead. This skill decides *where to cut and in what order*; it does not document the legacy logic inside the seam.

## Workflow

1. **Pick a candidate bounded context.** Name one cluster of behavior with high internal cohesion and a thin, stable interface to the rest — a domain concept (DDD bounded context / aggregate), not an org-chart team or a technical layer. Extract exactly one per effort.
2. **Gather seam evidence — do not prescribe a cut without it.** Capture three artifacts: (a) a call/module-coupling graph for the candidate (madge, dependency-cruiser, or equivalent) showing inbound call sites and shared symbols; (b) a commit co-change report (files that always change together belong together); (c) the transaction boundaries the candidate participates in. A good seam has few inbound call sites and a small shared vocabulary.
3. **Map data ownership and let it veto.** List every table the candidate reads and writes, and who else touches each. A service that does not own its data is not a service. If the candidate and the monolith both need write access to the same tables inside one transaction, the seam is wrong or not ready — stop and pick a different seam.
4. **Plan the data split.** Decide which tables move, how to break foreign keys across the new boundary, and how to replace queries that joined across it. Specify the migration mechanism: dual-write or CDC, plus a reconciliation check before and after cutover.
5. **Design an anti-corruption layer.** Put a translation facade at the boundary so the extracted service speaks its own clean domain language and the monolith keeps its own. This lets you fix the model on one side without a coordinated big-bang change.
6. **Plan distributed failure modes per operation.** Each former local call is now a network call that times out, retries, and partially fails. For each operation crossing the seam, decide whether it can be eventually consistent; add idempotency, timeouts, circuit breakers, and a trace that follows the request across the boundary. If any operation truly needs cross-service ACID, the seam is in the wrong place — return to step 1.
7. **Sequence the extraction strangler-style.** First create the seam in-process (a clear interface/module inside the monolith) and prove every caller routes through it. Then move the implementation behind a network call with the old path behind a flag. Migrate and reconcile data. Only delete the in-monolith code after the service has served real production traffic through a full cycle.

## Quality bar

A seam is ready to extract only when all hold:
- It maps to a named bounded context, not a layer or a team.
- Inbound call sites are few and pass through one interface; the shared vocabulary at the boundary is small.
- The candidate exclusively owns the tables it writes; no other component writes them inside the same transaction.
- A data-migration plan exists with a reconciliation step.
- Every cross-seam operation has a defined consistency model; none requires cross-service ACID.
- The extraction is staged (in-process seam → network behind flag → cut), not a single switch.

## Do NOT

- Do NOT cut along the org chart or a technical layer; cut along a bounded context.
- Do NOT propose a seam from intuition alone — produce the coupling graph, co-change report, and table ownership map first.
- Do NOT extract a service that shares write access to tables with the monolith inside one transaction.
- Do NOT do a big-bang cut; never delete the in-monolith path before the service has served real traffic.
- Do NOT dual-write or use CDC without a reconciliation check on both sides.
- Do NOT extract to fix slow deploys, flaky tests, or unclear modules — modularize in-process first. Only extract when independent scaling, deployment, or team ownership genuinely demands it. A well-modularized monolith beats a badly-cut set of services on nearly every axis.
