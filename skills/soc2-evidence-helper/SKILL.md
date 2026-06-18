---
name: SOC 2 Evidence Helper
description: Organizes SOC 2 Type I and Type II evidence, maps engineering controls to Trust Service Criteria, and guides efficient evidence collection. Load when preparing for an audit, closing auditor findings, or building a compliance program.
---

# SOC 2 Evidence Helper

SOC 2 audits measure whether your security controls exist (Type I) and operate consistently over time (Type II). Engineering teams waste the most time gathering evidence reactively. Build collection into normal operations.

## Understand the Five Trust Service Criteria

SOC 2 is organized around five criteria — Security (CC) is required; the others are optional scope extensions:
- Security (CC): logical access, change management, risk assessment, incident response, monitoring.
- Availability (A): uptime commitments, capacity planning, backup and recovery.
- Processing Integrity (PI): complete and accurate data processing, error handling.
- Confidentiality (C): data classification, encryption in transit and at rest, NDA controls.
- Privacy (P): personal data lifecycle — collection notice, consent, retention, deletion.

Scope your audit before collecting any evidence. Auditors will only test criteria in scope.

## Map Controls to Criteria

For each in-scope criterion, identify the control, the evidence artifact, and the system of record. Example mapping:
- CC6.1 (logical access): evidence is access reviews from your IdP (Okta, Entra) exported quarterly, plus offboarding tickets showing timely deprovisioning.
- CC7.2 (monitoring): evidence is your SIEM or CloudTrail alert configuration plus a sample of alerts investigated in the period.
- CC8.1 (change management): evidence is your PR merge policy (required review, passing CI) plus a sample of merged PRs.

Create this map in a shared doc before the audit begins. Do not create evidence artifacts that do not reflect how the system actually operates — auditors test consistency, and fabricated evidence is a finding.

## Evidence Collection Efficiency

Automate collection wherever the system supports it:
- Access reviews: export from IdP on a scheduled basis and store in a designated compliance folder.
- Vulnerability scans: schedule the scanner and archive reports automatically; do not run ad hoc scans only when the auditor asks.
- Penetration test reports: retain the full report including findings, not just the executive summary.
- Policy attestations: use a GRC tool or a simple form with timestamps — manual sign-off with no timestamp is not auditable.

## Responding to Auditor Requests

- Provide the minimum necessary evidence — do not over-share system diagrams or internal design docs not required by the control.
- When a control has a gap (the control was not operating for part of the period), disclose it proactively with a documented remediation date. Auditors respond better to transparency than to discovering gaps themselves.
- For Type II, auditors will sample from the full review period. Maintain artifacts continuously, not just in the month before fieldwork.

## Common Engineering Findings to Avoid

- Access not revoked within 24 hours of offboarding (automate deprovisioning).
- No documented change management policy even when the team does use pull requests.
- Encryption enabled but no evidence it is configured correctly (export config screenshots or IaC).
- Incident response plan exists but was never tested — run at least one tabletop exercise annually.
