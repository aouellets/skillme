---
name: Idempotency Enforcer
description: Adds idempotency keys and request deduplication so at-least-once delivery and client retries never double-charge or double-ship. Use when building any write endpoint that triggers payments, orders, emails, or other non-reversible side effects.
---
# Idempotency Enforcer

Networks retry. Clients time out and resubmit. Queues deliver at-least-once. The only safe assumption is that any write will arrive more than once, so make the second arrival a no-op that returns the first result.

## Require a Client-Supplied Key
Accept an Idempotency-Key header (a UUIDv4 or client-generated token) on all unsafe POSTs. Do NOT derive the key server-side from the payload alone — a legitimate second order with identical fields must be allowed, so the client owns intent. Reject requests missing the key with 400 on endpoints where duplication is dangerous.

## Scope the Key Correctly
A key is unique per (account/tenant + endpoint + key value). Never share a namespace across tenants or routes, or one user's retry could collide with another's. Bind the stored record to a hash of the request body: if the same key arrives with a different body, return 422 — that signals a client bug, not a retry.

## Store Intent, Then Replay
Upsert a row keyed on the idempotency key inside the same transaction as the side effect, using a unique constraint to win the race. On first request: persist status=in_progress, do the work, persist the full response (status code + body). On any duplicate: return the stored response verbatim. While the original is still in_progress, return 409 or have the client poll — never run the work twice concurrently.

## Expire and Clean Up
Keys are short-lived dedup tokens, not permanent audit log. TTL them (24h to 7 days is typical) and sweep expired rows. Document the window so clients know how long a retry stays safe.

## Make the Effect Atomic
The side effect and the key write must commit together. If they can't share a transaction (e.g. an external charge), use the provider's own idempotency key, store your key before calling out, and reconcile on crash via the provider's status lookup rather than re-charging blindly.

## When to Skip
Pure reads, naturally idempotent PUTs replacing a full resource by ID, and operations behind a unique business constraint (one row per user per day) may not need a separate key layer. Add the machinery where a duplicate causes irreversible harm — money, inventory, notifications — not everywhere.
