# Security Policy

Skill Me is a hosted MCP server and web catalog. We take the safety of the
connector, the catalog, and our users' data seriously and welcome good-faith
security research.

## Reporting a vulnerability

Email **security@skillme.dev** (routes to the maintainers). Please do **not**
open a public GitHub issue for security reports.

Include where you can:

- A clear description of the issue and its impact.
- Steps to reproduce (a proof of concept, request/response, or short script).
- The affected surface (MCP endpoint, a specific web route, or a catalog skill).
- Your assessment of severity and any suggested fix.

**What to expect:** we aim to acknowledge a report within **3 business days**,
give an initial assessment within **7 business days**, and keep you updated
through remediation. We'll credit you on request once a fix ships.

## Scope

**In scope**
- The MCP server: `https://skillme.dev/api/mcp`
- The web catalog and its API routes (`skillme.dev`)
- Authentication/identity handling, install/library data isolation between users
- This repository's source code

**Out of scope**
- Third-party platforms we build on — Vercel, Supabase, and the Anthropic API.
  Report those to the respective vendor.
- The *content* of user-submitted skills. Every submission passes a
  Claude-powered safety classifier before listing, but a skill is instructional
  text, not executable code we run. If you find a skill whose instructions are
  unsafe, deceptive, or attempt prompt-injection/exfiltration, report it to
  security@skillme.dev and we'll remove it.
- Findings that require a compromised user device or MITM of TLS.
- Volumetric DoS / brute-force without a concrete underlying vulnerability.

## Safe harbor

We will not pursue or support legal action against researchers who, in good
faith:

- Make a reasonable effort to avoid privacy violations, data destruction, and
  service disruption;
- Only interact with accounts/data they own or have explicit permission to test;
- Give us reasonable time to remediate before public disclosure.

If in doubt about whether an action is authorized, ask first at
security@skillme.dev.

## Supported versions

Skill Me is a continuously deployed hosted service — the live production
deployment is the only supported version. There are no self-hosted release
branches to patch.

## Data & privacy

How we handle user data is described in our
[Privacy Policy](https://skillme.dev/privacy): no login, no access
to your conversations/memory/files, and we store only the skills, ratings, and
collections you choose to create.

## No bug bounty (yet)

We don't currently run a paid bounty program, but we genuinely appreciate
responsible disclosure and will publicly credit valid reports.
