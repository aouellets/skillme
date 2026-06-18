---
name: Postmortem Writer
description: Write blameless postmortems with timeline, contributing factors, and action items.
---

# Postmortem Writer

A postmortem turns an incident into organizational learning. Done blamelessly, it
makes systems safer; done as a witch hunt, it makes people hide problems.

## The blameless principle

Assume everyone acted reasonably given the information they had at the time. The goal
is to fix **systems and processes**, not to assign fault to people. If a person could
make a mistake, the system allowed it — fix the system.

## Document structure

```
# Postmortem: <short incident title>
Date of incident: <date>   Severity: <SEV1-4>   Authors: <names>
Status: Draft | Reviewed | Closed

## Summary
<2-4 sentences: what happened, impact, and resolution — readable by anyone.>

## Impact
- Users affected: <how many / which>
- Duration: <start -> detection -> mitigation -> resolution>
- Business impact: <revenue, SLA, trust>

## Timeline (all times in <TZ>)
- HH:MM  <event — what happened or what was observed>
- HH:MM  <detection — how we found out>
- HH:MM  <mitigation step>
- HH:MM  <resolved>

## Contributing factors
<The chain of conditions that allowed this. Usually multiple — single "root causes"
are rare. Use "5 whys" but stop at systemic, not personal, answers.>

## What went well
<Detection, response, tooling that helped — reinforce these.>

## What went poorly
<Gaps in monitoring, runbooks, ownership — without blaming individuals.>

## Action items
| Action | Type (prevent/detect/mitigate) | Owner | Due | Ticket |
|--------|-------------------------------|-------|-----|--------|
| ...    | ...                           | ...   | ... | ...    |

## Lessons learned
<What the org now knows that it didn't before.>
```

## Writing the timeline

- Reconstruct from logs, alerts, chat, and deploy history — not memory alone.
- Separate **what happened** (events) from **what we knew** (detection/perception).
- Note the gap between impact start and detection — shrinking it is often the biggest win.

## Action items that stick

- Each action is **specific, owned, dated, and ticketed** — or it won't happen.
- Prefer systemic fixes (guardrails, automated checks) over "be more careful".
- Classify each as prevent / detect faster / mitigate faster.
- Track them to closure in the next review; an open postmortem with stale actions is theater.

## Severity guide

- **SEV1**: major outage / data loss — full postmortem required, exec-visible.
- **SEV2**: significant degradation — postmortem required.
- **SEV3-4**: minor — lightweight writeup, lessons captured.

## Anti-patterns

- Naming and shaming — guarantees the next incident is hidden.
- A single "root cause" — incidents are almost always multi-causal.
- Action items with no owner or date — they evaporate.
- Skipping the postmortem because "we're too busy" — you'll pay for it again.
