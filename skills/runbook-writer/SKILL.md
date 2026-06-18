---
name: Runbook Writer
description: Writes an operational runbook for a service covering symptoms, diagnostic checks, mitigations, and escalation paths. Use when shipping a new service or when an existing service lacks incident procedures.
---

# Runbook Writer

A runbook is a recipe for a tired engineer at 2 AM. It must answer: what is broken, how do I confirm it, what do I try first, and when do I give up and escalate.

## Required Sections

Every runbook gets exactly these sections in this order.

### 1. Service Overview (3-5 lines)

State what the service does, its criticality (which SEVs it can cause), its SLO target, and its direct dependencies. Skip history and rationale.

### 2. Symptoms and Alerts

List each alert that fires for this service. For each:
- Alert name and what condition triggers it.
- What it means in plain language (not the PromQL).
- Expected SEV range when it fires.

### 3. Diagnostic Checks

Numbered, runnable steps. Each step must be executable in under 2 minutes.

1. Check service health endpoint and current error rate dashboard link.
2. Check dependency health (upstream/downstream) — list the specific dashboards or commands.
3. Check recent deploys: confirm or rule out a code change as cause.
4. Check resource saturation: CPU, memory, disk, connection pool exhaustion.
5. Check logs for the first occurrence of the error pattern.

Use real command patterns (no placeholders left for the user to invent). Mark any step that requires elevated permissions.

### 4. Mitigations (ordered by speed)

- Fast (under 5 min): rollback last deploy, toggle feature flag off, redirect traffic to healthy region.
- Medium (5-30 min): scale out replicas, drain and restart unhealthy pods, flush a poisoned cache.
- Slow (over 30 min): restore from backup, run a data repair job, coordinate with a dependency team.

Label each mitigation with its risk: Low / Medium / High. High-risk mitigations require IC approval.

### 5. Escalation Path

- First escalation: service team on-call. Include Slack handle or PagerDuty policy name.
- Second escalation: platform/infra team if the issue is infrastructure-layer.
- Third escalation: vendor support contact if a managed service (include account ID and SLA tier).

### 6. Post-Incident

Link to the postmortem template. Note any automatic rollback or alerting that should trigger after resolution.

## Do / Don't

- Do: include real URLs and command templates. A runbook without links is a paragraph, not a procedure.
- Do: version the runbook with the service. Stale runbooks cause more harm than none.
- Don't: document root-cause analysis in a runbook. That belongs in a postmortem.
- Don't: write steps that require guessing or judgment without a fallback. If a step can fail, say what to do when it fails.
