---
name: Circuit Breaker Builder
description: Adds circuit breakers, timeouts, and bulkheads around flaky upstream dependencies so a slow or failing service degrades gracefully instead of cascading. Use when integrating an external API or service that can be slow or unavailable.
---
# Circuit Breaker Builder

The failure that takes down a system is rarely the dependency dying — it's your service piling up threads waiting on it. Resilience means failing fast and isolating the blast radius so one sick dependency can't drain your whole capacity.

## Always Set a Timeout
A call with no timeout is a resource leak waiting to happen. Set an explicit, aggressive timeout on every outbound call (connect and read separately). The budget should be smaller than your own caller's timeout, so you fail before they give up. Default library timeouts are often minutes or infinite — never trust them.

## Three States, Clear Transitions
A breaker has closed (calls pass), open (calls fail instantly without touching the dependency), and half-open (a few probe calls test recovery). Trip from closed to open when failures cross a threshold — prefer a rolling error rate (e.g. >50% over the last N calls with a minimum volume) over a raw count, which is noisy at low traffic. After a cooldown, go half-open; if probes succeed, close; if any fail, re-open and reset the cooldown.

## Fail Fast and Fall Back
While open, return immediately — a cached value, a sane default, a degraded response, or a clean error. The point is to stop spending threads, connections, and latency on a call you expect to fail. Decide the fallback per call site: stale cache for reads, queue-for-later for writes, hard error only when there's no safe degradation.

## Bulkhead to Contain Blast Radius
Isolate each dependency in its own pool — separate connection pool, thread pool, or concurrency semaphore. Then a saturated dependency exhausts only its own bulkhead, leaving capacity for unrelated traffic. Without bulkheads, one slow upstream consumes every worker and the whole service stalls.

## Tune With Real Data and Watch It
Thresholds and cooldowns are guesses until you measure. Emit metrics for state transitions, trip counts, and fallback rates; alert when a breaker opens. A breaker that flaps constantly is mistuned or masking a real outage that needs paging.

## When to Skip
Don't wrap fast, in-process, or highly reliable local calls — the overhead and false trips aren't worth it. Reserve breakers for network calls to dependencies that can realistically be slow or down.
