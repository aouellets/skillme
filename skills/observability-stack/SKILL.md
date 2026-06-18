---
name: Observability Stack
description: Instrument apps with logs, metrics, and traces.
---

# Observability Stack

Instrument systems so you can answer "what's wrong and why" from telemetry.

## The three signals

- Logs: discrete events with context. Use for debugging specifics.
- Metrics: aggregated numbers over time. Use for dashboards and alerts.
- Traces: the path of a request across services. Use to find latency and failure source.

Adopt OpenTelemetry so instrumentation is vendor-neutral.

## Structured logs

```json
{ "level": "error", "msg": "payment failed", "trace_id": "abc", "user_id": 42, "amount_cents": 999 }
```

- Always JSON, never free text. Include `trace_id` to correlate with traces.
- Standard fields: timestamp, level, service, trace_id, span_id.
- Log at boundaries; avoid logging in hot loops. Never log secrets or PII.

## Metrics

- Instrument the RED method for services: Rate, Errors, Duration.
- Use the USE method for resources: Utilization, Saturation, Errors.
- Use histograms for latency (so you can compute p50/p95/p99), counters for events, gauges for levels.
- Keep label cardinality low — high-cardinality labels (user_id) blow up the metrics store.

## Traces

- Propagate context (W3C `traceparent`) across every service hop and async boundary.
- Span each meaningful operation; add attributes (db.statement, http.status).
- Sample intelligently: head-sample a percentage, tail-sample to keep all errors/slow traces.

## Alerting

- Alert on symptoms users feel (error rate, latency SLO burn), not raw causes (CPU).
- Use SLOs and error budgets; page only on actionable, urgent conditions.
- Every alert needs a runbook link.

## Rules

- One correlation id flows through logs, metrics exemplars, and traces.
- Don't measure everything — instrument the critical paths and golden signals first.
- Keep dashboards few and meaningful; one per service showing RED.

## Edge cases

- Async/queues: propagate trace context in the message metadata.
- Batch jobs: emit start/finish metrics and duration; alert on missed runs.
- Cardinality explosions: drop or aggregate offending labels at the collector.
