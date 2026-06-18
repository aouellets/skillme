---
name: Rate Limit Handler
description: Implements exponential backoff with full jitter, honors Retry-After, and adds client-side throttling so you stay under an upstream API's rate limits instead of hammering them. Use when calling any rate-limited or quota-enforced third-party API.
---
# Rate Limit Handler

Retrying harder is how a transient limit becomes an outage. The goal is to back off in a way that spreads load, respects what the server tells you, and prevents your own fleet from synchronizing into a thundering herd.

## Honor the Server First
When a 429 or 503 carries a Retry-After header, obey it exactly — it is the server telling you when it will accept you again, and it overrides any local backoff math. Parse both the delta-seconds and HTTP-date forms. Read rate-limit headers (X-RateLimit-Remaining, Reset) proactively and slow down as you approach zero, rather than waiting to be rejected.

## Exponential Backoff With Full Jitter
When there is no Retry-After, compute delay as a capped exponential (base * 2^attempt, clamped to a max like 30-60s) and then apply full jitter: sleep a random value between 0 and that cap, not the cap itself. Full jitter is what de-synchronizes many clients retrying the same downed service. Equal jitter is acceptable; fixed backoff is not — it recreates the herd.

## Cap Attempts and Total Budget
Bound both retry count (e.g. 5) and total elapsed time, so a request fails fast instead of hanging a caller for minutes. Only retry idempotent or idempotency-keyed operations; retrying a non-idempotent POST risks duplicate effects. Retry on 429, 502, 503, 504 and connection errors — never on 400, 401, 403, 404, 422.

## Throttle Proactively With a Token Bucket
Don't rely on reacting to 429s. Put a client-side limiter in front of the API: a token bucket sized to the published quota smooths bursts and keeps you under the limit by design. Share the bucket across your fleet via a central store (e.g. Redis) when many workers hit one upstream, so the aggregate rate stays bounded.

## Make It Observable
Emit metrics for retry counts, backoff durations, and 429 rates. A rising 429 rate is an early warning to lower concurrency or request a quota increase before it becomes errors users see.

## When to Skip
A single best-effort background call may just fail and move on. Reserve the full backoff-plus-bucket stack for hot paths and high-volume integrations where exceeding the limit blocks real work.
