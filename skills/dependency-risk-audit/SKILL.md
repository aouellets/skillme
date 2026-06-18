---
name: Dependency Risk Audit
description: Audits third-party dependencies for CVEs, abandoned packages, license risk, and supply-chain hygiene indicators. Load when adding new packages, reviewing a lockfile, or preparing for a security review.
---

# Dependency Risk Audit

Third-party packages are the most common source of supply-chain compromise and known-vulnerability exploitation. Treat dependency selection as a security decision, not just a convenience one.

## CVE and Known Vulnerability Triage

Run the ecosystem's native audit tool first (npm audit, pip-audit, bundle audit, govulncheck). For each finding:
- Confirm exploitability in context — a CVE in a CLI-only code path of a server-side lib may not be reachable.
- Check whether a fixed version exists and whether upgrading is a semver-compatible bump.
- Flag any CVSS 7.0+ finding with no available fix as a blocking risk requiring a compensating control or replacement.
Do not dismiss findings without a written reason.

## Maintenance Health Signals

A dependency with no CVEs today can become a liability tomorrow. For any new or high-traffic dependency check:
- Last release date and commit activity (no release in 24+ months on an active ecosystem is a yellow flag).
- Number of open security issues versus closed.
- Whether the package has a documented security policy or contact.
- Single-maintainer packages without a succession plan carry concentration risk — flag them.

## Supply-Chain Hygiene

Install-time attacks abuse package publication pipelines. Apply these checks:
- Verify the package name exactly matches the intended project — typosquatting is common.
- Confirm the publisher identity on the registry matches the known author or organization.
- Prefer packages that publish provenance attestations (SLSA, npm provenance, sigstore) when available.
- Pin transitive dependencies in lockfiles and commit them to source control. Never allow floating ranges in production lockfiles.
- Enable automated lockfile integrity checks in CI (npm ci, not npm install).

## License Risk

Licenses create legal exposure, not just engineering risk. Flag any dependency with a copyleft license (GPL, AGPL, EUPL) in a proprietary codebase — these require legal review before shipping. Acceptable defaults for most commercial projects: MIT, Apache-2.0, BSD-2, BSD-3, ISC.

## Remediation Priority

Rank findings: (1) exploitable CVE with available fix, (2) exploitable CVE no fix — needs replacement, (3) abandoned package on a critical path, (4) license conflict, (5) maintenance concern only. Address (1) and (2) before any release. Defer (5) to a scheduled dependency hygiene sprint.
