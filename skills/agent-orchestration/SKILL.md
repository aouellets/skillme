---
name: Agent Orchestration
description: Design reliable multi-agent systems.
---

# Agent Orchestration

Coordinate multiple LLM agents to solve tasks a single prompt can't.

## When to use multiple agents

- The task decomposes into distinct skills (research, then write, then review).
- Context would overflow a single agent, so you split and summarize.
- You need parallelism across independent subtasks.

Don't multiply agents needlessly — each hop adds latency, cost, and failure surface. Prefer a single capable agent until it clearly can't cope.

## Topologies

- Orchestrator-workers: a planner decomposes the task and routes subtasks to specialized workers, then synthesizes results.
- Sequential pipeline: fixed stages, output of one feeds the next.
- Router: classify the input, dispatch to the right specialist.

## Task routing

```text
1. Orchestrator plans: list subtasks + which worker handles each.
2. Dispatch subtasks (parallel where independent).
3. Each worker gets only the context it needs.
4. Orchestrator merges results and decides next step or finish.
```

## Context passing

- Pass minimal, relevant context to each agent — not the whole history.
- Summarize long intermediate results before forwarding.
- Use a shared scratchpad/blackboard for artifacts agents produce.
- Keep a clear schema for inter-agent messages (task, inputs, expected output).

## Failure recovery

- Validate each agent's output against a schema before using it.
- Retry a failed subtask with feedback; cap retries to avoid loops.
- Add a critic/reviewer step for high-stakes outputs.
- Set global budgets (max steps, tokens, time) and a circuit breaker to stop runaway loops.

## Rules

- Make each agent's role and output contract explicit.
- Prefer deterministic orchestration code over an LLM that decides everything — keep control flow inspectable.
- Log every agent call (inputs, outputs, cost) for debugging and evals.
- Make tools idempotent; agents may retry.

## Edge cases

- Infinite delegation loops: track depth and forbid re-dispatching the same subtask.
- Conflicting outputs: have the orchestrator arbitrate with a tie-break rule.
- Partial failure: return best-effort results with a clear note on what failed.
