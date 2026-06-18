---
name: Escalation Summary
description: Writes a tight escalation summary to engineering or management with repro steps, customer impact, and a clear ask. Use when a ticket must leave the support queue for specialist action.
---

# Escalation Summary

Engineers and managers receive escalations all day. A good escalation summary gets a response; a vague one gets queued. Write as if the reader has zero context and thirty seconds.

## Required sections (always include all five)

1. One-line summary: what is broken or wrong, for whom, since when.
2. Customer impact: number of affected accounts or users, revenue or tier, business impact (cannot complete checkout, cannot log in, data loss, etc.). Use hard numbers where available; estimate where not, and label estimates as such.
3. Repro steps: numbered, precise, environment-specific. Include what was expected vs. what happened. If you cannot repro, say so explicitly and explain what evidence you do have.
4. What support has already tried: list every action taken so the escalation team does not repeat work.
5. The ask: one sentence stating exactly what you need — a fix, a workaround, a timeline, a decision.

## Severity language

Use consistent severity labels: P1 (service down or data loss, immediate response needed), P2 (major feature broken, significant customer impact, response within 4 hours), P3 (degraded feature, workaround exists, response within 1 business day). Include the severity label in the subject line or ticket title.

## Evidence package

Attach or link: the original customer ticket(s), any screenshots or screen recordings the customer provided, relevant log excerpts (not full logs — only the lines that show the failure), and the account or order IDs needed to reproduce.

## Tone and framing

Escalation summaries are factual, not emotional. Do not editorialize about how the customer felt. Do not assign blame. If the issue has a known workaround, state it — this often changes the urgency calculation. If the issue is time-sensitive because of a customer SLA or renewal, say so plainly.

## What to avoid

- Do not escalate without first confirming the issue is outside support's scope to resolve.
- Do not send partial escalations and promise to 'follow up with more details' — gather everything first.
- Do not copy the customer on an internal escalation.
