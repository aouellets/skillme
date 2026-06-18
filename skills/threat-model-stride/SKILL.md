---
name: Threat Model STRIDE
description: Applies STRIDE threat modeling to a described feature or system, enumerates threats per category, and prioritizes mitigations by exploitability and impact. Load when reviewing auth, data flows, or new external integrations.
---

# Threat Model STRIDE

STRIDE is a structured framework for identifying security threats early, when fixes are cheapest. Apply it to any feature touching auth, data storage, external calls, or privilege changes.

## Scope the System First

Before enumerating threats, establish a minimal data-flow diagram in prose:
- Identify actors (users, services, external APIs).
- Identify trust boundaries (browser/server, service/DB, internal/external network).
- List data assets and their sensitivity tiers (PII, credentials, financial, public).
Do not proceed until boundaries are explicit — vague scope produces vague threats.

## Apply STRIDE Per Component

For each component crossing a trust boundary, evaluate all six categories:

- Spoofing: can an attacker impersonate a user, service, or token? Check auth mechanisms at every entry point.
- Tampering: can inputs, stored records, or in-flight data be modified without detection? Check integrity controls and audit logs.
- Repudiation: can an actor deny an action? Check whether sensitive operations are logged with actor identity and timestamp.
- Information Disclosure: can data leak to unauthorized parties? Check access controls, error messages, logs, and caches.
- Denial of Service: can an attacker exhaust resources or degrade availability? Check rate limiting, queue depth limits, and timeouts.
- Elevation of Privilege: can an actor gain permissions beyond their role? Check authorization checks at every privilege boundary, not just at entry.

## Prioritize by DREAD-Light

Score each threat on two axes only — exploitability (how easy to trigger without special access) and impact (data loss, service loss, or compliance violation). Produce a ranked short list: Critical, High, Medium. Ignore Low findings unless they chain into a higher-severity path.

## Mitigation Standards

For each Critical and High finding, recommend one concrete control:
- Prefer existing platform primitives (JWT validation middleware, ORM parameterization, IAM roles) over custom code.
- Specify the control, not just the category ('add HMAC signature on webhook payload' not 'add integrity check').
- Flag any mitigation that requires a schema change or new dependency — those need separate review.

## Output Format

Return a structured list: threat category, affected component, attack scenario in one sentence, severity, recommended control, and owner team. Keep it reviewable in under ten minutes by a non-security engineer.
