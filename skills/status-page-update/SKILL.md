---
name: Status Page Update
description: Writes clear, honest customer-facing incident status updates at each lifecycle stage: investigating, identified, monitoring, and resolved. Use during active incidents to communicate with customers and stakeholders.
---

# Status Page Update

Customers do not need your stack trace. They need to know what is broken, whether you know about it, and when it will be fixed. Every update earns trust or burns it.

## Four Stages, Four Templates

### Investigating

Use immediately when an issue is confirmed. You do not need a cause yet.

Pattern: 'We are investigating [symptom] affecting [who]. Customers may experience [observable impact]. We will post an update within [time window].'

Rules: Never speculate on cause. Never promise a fix time. Give a concrete next-update time and keep it.

### Identified

Use once root cause is understood, even if fix is not deployed.

Pattern: 'We have identified the cause of [symptom] as [plain-language cause — no jargon]. We are [specific action in progress] and expect [outcome] by [time]. We will post an update by [next update time].'

Rules: Plain-language cause only. No internal system names. Acknowledge if impact was broader than previously stated.

### Monitoring

Use after deploying a fix but before declaring resolved.

Pattern: 'We have deployed a fix for [symptom]. [Metric or signal] has returned to normal levels. We are monitoring to confirm stability and will resolve this incident once we are confident in the fix.'

Rules: State what you are watching. Give a realistic resolve window (usually 30-60 minutes). Do not rush to resolve — a premature resolve followed by re-open destroys trust.

### Resolved

Use after sustained normal operation.

Pattern: 'This incident is resolved. [Symptom] affected [scope] from [start time] to [end time] ([duration]). We have confirmed normal operation. A full postmortem will be published within [48-72 hours] for SEV1/2 incidents.'

Rules: Give actual times in the user's timezone or UTC with label. Commit to a postmortem only if you will publish one.

## Tone Rules

- Write at a 7th-grade reading level. No acronyms without expansion.
- Use 'we' not 'the team' or passive voice.
- Do not say 'sorry for the inconvenience'. Say 'We understand this impacts your work and we are moving as fast as possible.'
- Every update must have a timestamp and a next-update time or a resolution statement.

## Anti-Patterns to Avoid

- Vague cause ('due to an unexpected issue'). Give at least 'a configuration error in our database layer'.
- Missing impact scope. Say 'customers using API key authentication in us-east-1' not 'some customers'.
- Back-to-back 'Investigating' posts with no new information. Add one new fact per update or explicitly say 'No new information yet; next update in 30 minutes.'
