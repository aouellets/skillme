---
name: Feature Flags
description: Implement safe, controllable feature flags.
---

# Feature Flags

Decouple deploy from release; ship code dark and turn it on safely.

## Flag types

- Release flags: gate unfinished features. Short-lived; remove after rollout.
- Ops flags / kill switches: disable a feature or dependency in an incident.
- Experiment flags: A/B tests with metrics.
- Permission flags: gate features by plan or entitlement.

Don't mix purposes in one flag — lifecycle and ownership differ.

## Evaluation

```ts
const ctx = { userId, plan, country };
if (flags.isEnabled('new-checkout', ctx)) {
  renderNewCheckout();
} else {
  renderOldCheckout();
}
```

- Evaluate with context (user, attributes) for targeting.
- Default to the safe value (usually "off") if the flag service is unreachable.
- Cache evaluations and stream updates so flips take effect fast without per-request network calls.

## Rollout strategies

- Percentage rollout: hash a stable key (user id) into buckets so a user's experience is consistent.
- Ring deployment: internal -> beta -> small % -> full.
- Targeting rules: by plan, region, or allowlist for early access.

## Kill switches

- Every risky feature ships behind a flag you can flip off without a deploy.
- Keep kill switches simple, well-tested, and independent of the feature they guard.

## Rules

- Make flag checks side-effect free and fast.
- Avoid deeply nested flag combinations — they explode the test matrix.
- Log which variant served each request for debugging and experiment analysis.
- Treat flag config as auditable, access-controlled change.

## Flag hygiene

- Set an expiry/owner on every release flag. Stale flags rot into hidden dead code.
- Remove the flag and the dead branch once a feature is fully rolled out.

## Edge cases

- Consistency: use the same bucketing key across services so a user sees one variant everywhere.
- Server/client mismatch: evaluate on the server and pass the decision down to avoid flicker.
- Experiments: ensure random, sticky assignment and don't change allocation mid-experiment.
