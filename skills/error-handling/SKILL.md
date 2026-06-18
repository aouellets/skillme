---
name: Error Handling
description: Design typed, observable, recoverable error handling.
---

# Error Handling

Treat errors as a first-class part of the design, not an afterthought.

## Principles

1. Distinguish expected failures (validation, not-found) from bugs (nulls, type errors).
2. Model expected failures as values; let truly exceptional bugs throw.
3. Fail fast and loud in development; degrade gracefully in production.
4. Every error that reaches a user should be actionable; every error logged should be diagnosable.

## Typed errors

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

class NotFoundError extends Error {
  readonly code = 'NOT_FOUND';
  constructor(readonly resource: string) { super(\`${resource} not found\`); }
}
```

- Give each error a stable `code` for programmatic handling and i18n.
- Use a Result type at API boundaries so callers must handle the error path.
- Never swallow errors with an empty `catch {}`.

## Boundaries

- Wrap independent units (a request, a React subtree, a job) in a boundary that catches, logs, and renders a fallback.
- A boundary should never re-throw silently; it owns the recovery decision.

## Observability hooks

- Attach context (request id, user id, inputs) when capturing, not at the throw site only.
- Log at the boundary once, not at every layer — duplicate logs hide the real cause.
- Send to an error tracker with grouping by `code` + stack; alert on new error types and rate spikes.

## Retries

- Retry only idempotent, transient failures (network, 5xx, timeouts) with exponential backoff + jitter.
- Cap attempts; add a circuit breaker so a dead dependency doesn't amplify load.
- Never retry on 4xx validation errors.

## Rules

- Preserve the cause chain: `new Error(msg, { cause })`.
- Don't leak internals (stack traces, SQL) to clients; return a safe message + correlation id.
- Validate input at the edge so the core can assume well-formed data.
- Make cleanup run on every path (`finally`, defer, context managers).

## Edge cases

- Async: unhandled promise rejections crash Node — add a global handler that logs and exits cleanly.
- Partial failures in batch jobs: collect per-item errors and continue; report a summary.
- Error in the error handler: keep the fallback path dependency-free and simple.
