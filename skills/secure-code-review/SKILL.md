---
name: Secure Code Review
description: Reviews code for the highest-impact security flaws: broken authorization, injection, SSRF, mass assignment, and unsafe deserialization. Load when reviewing auth code, new API endpoints, or any code that handles untrusted input.
---

# Secure Code Review

Secure code review is not a checklist audit — it is a focused search for the flaw categories that cause the most breaches. Spend time proportional to risk: auth logic and input handling deserve more scrutiny than rendering or config.

## Authorization Before Authentication

Broken authorization (OWASP A01) is the most common high-severity finding. For every action that reads or mutates a resource:
- Confirm the code checks that the authenticated user owns or has permission to access the specific resource ID, not just that the user is logged in.
- Look for IDOR patterns: resource IDs passed in request parameters without ownership verification.
- Verify that admin or privileged actions enforce role checks at the function level, not only at the route level — middleware-only checks are bypassed by internal calls.
- Check that authorization logic is centralized. Duplicated per-endpoint auth checks drift and create gaps.

## Injection Surfaces

For any code that constructs queries, commands, or markup from user input:
- SQL: confirm parameterized queries or a safe ORM API throughout — no string concatenation into query bodies, even for identifiers or ORDER BY clauses.
- Shell commands: flag any exec/spawn call that includes user input. The correct fix is to avoid shell execution; if unavoidable, use argument arrays not string interpolation.
- HTML/template: confirm output encoding is applied for the correct context (HTML, attribute, JavaScript, URL). Verify that rich-text user content passes through a sanitization library with an allowlist, not a blocklist.
- Path traversal: any user-supplied filename or path must be normalized and confined to an expected root directory before use.

## Server-Side Request Forgery (SSRF)

Any code that makes outbound HTTP requests with a URL derived from user input is an SSRF candidate:
- Confirm the target URL is validated against an allowlist of permitted hosts/schemes before the request is made.
- Cloud-hosted services: verify the code blocks requests to instance metadata endpoints (169.254.169.254, fd00:ec2::254).
- Redirects: confirm the HTTP client is configured to not follow redirects automatically, or that each redirect destination is re-validated.

## Mass Assignment and Deserialization

- Mass assignment: confirm that model or ORM binding uses an explicit allowlist of permitted fields, not a deny-list. Any field that controls permissions, ownership, or internal state must be excluded from user-supplied binding.
- Deserialization: flag any deserialization of user-supplied data using native object serialization formats (Java ObjectInputStream, Python pickle, PHP unserialize, Ruby Marshal). These are almost always unsafe with untrusted input. Prefer JSON or protobuf with explicit schema validation.

## What to Raise vs. What to Skip

Raise: any finding that allows an attacker to access data or perform actions beyond their authorization, execute code, or exfiltrate secrets. Skip: style issues, missing logging (unless the logging gap affects audit requirements), or theoretical issues with no realistic attack path in the current deployment context. Keep the review focused so engineers engage with findings rather than ignoring a long list.
