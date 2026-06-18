---
name: Code Review Checklist
description: Review a diff systematically for correctness, security, performance, and readability — and report findings ordered by severity.
---

# Code Review Checklist

Review the change, not the whole codebase. Read the diff first, then the
surrounding context only where the diff demands it.

## Pass 1 — Correctness
- Does the code do what the PR says it does?
- Edge cases: empty inputs, nulls, zero, very large values, concurrency.
- Error handling: are failures caught, surfaced, and not swallowed silently?
- Off-by-one, boundary conditions, and incorrect comparisons.

## Pass 2 — Security
- Untrusted input validated and escaped (injection, XSS, path traversal).
- No secrets, tokens, or credentials in code or logs.
- AuthN/AuthZ checks present where state changes.

## Pass 3 — Performance
- Obvious N+1 queries or loops doing I/O.
- Unbounded memory or result sets.
- Work that could be cached or batched.

## Pass 4 — Readability & maintainability
- Names say what things are; no surprises.
- The change matches the surrounding style.
- Tests cover the new behavior and the failure paths.
- No unrelated/orthogonal edits sneaking in.

## Reporting

Order findings by severity: blocking → should-fix → nit. For each, give the
location, the problem in one line, and a concrete suggestion. Praise what's
genuinely good — review is also signal, not just defect-finding.
