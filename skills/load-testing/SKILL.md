---
name: Load Testing
description: Design and interpret realistic load tests.
---

# Load Testing

Find capacity limits before users do.

## Test types

- Smoke: minimal load, verify the system works at all.
- Load: expected peak traffic; confirm SLOs hold.
- Stress: push past peak to find the breaking point.
- Soak: sustained load for hours to catch leaks and degradation.
- Spike: sudden surge to test autoscaling and recovery.

## Designing a scenario

1. Model real user journeys, not single-endpoint hammering.
2. Use realistic think time, pacing, and a mix of read/write operations.
3. Ramp up gradually; a cold start spike measures the wrong thing.
4. Parameterize data so each virtual user uses distinct inputs (avoid cache cheating).

```js
import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] },
};
export default function () {
  const res = http.get('https://api.example.com/items');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Assertions and SLOs

- Set thresholds that fail the test: p95 latency, error rate, throughput.
- Track percentiles (p95/p99), never just the average — averages hide tail pain.

## Interpreting results

- Watch where latency knee-bends as load rises; that's your saturation point.
- Correlate with server metrics (CPU, memory, DB connections, GC) to find the bottleneck.
- Distinguish errors caused by the system vs the load generator's own limits.

## Rules

- Test against a production-like environment and data volume; toy data lies.
- Never load-test production without coordination and safeguards.
- Run from infrastructure that can actually generate the target load (distributed if needed).
- Establish a baseline and re-run on changes to catch regressions.

## Edge cases

- Rate limits/WAF may throttle your test — allowlist the generator.
- Connection pool exhaustion often shows before CPU; monitor it.
- Autoscaling lag: spike tests reveal how long recovery takes.
