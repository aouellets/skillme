---
name: Webhook Receiver Hardener
description: Builds a signature-verified, replay-resistant, fast-acking async webhook endpoint that verifies-then-enqueues and survives retries and out-of-order delivery. Use when receiving webhooks from Stripe, GitHub, or any third party.
---
# Webhook Receiver Hardener

A webhook endpoint is an unauthenticated, internet-facing write path that an attacker can spam and a flaky sender will hammer with retries. Treat it as hostile input that must be verified before it is trusted and acknowledged before it is processed.

## Verify the Signature on the Raw Body
Compute the HMAC over the exact raw bytes, before any JSON parse or middleware reserialization — a re-encoded body changes whitespace and breaks the signature. Compare using a constant-time equality check, never ==. Load the signing secret from config, support two active secrets during rotation, and reject anything that fails with 401 before doing any work.

## Reject Replays
Most providers sign a timestamp alongside the payload. Reject requests whose timestamp is outside a tolerance window (commonly 5 minutes) to blunt replay attacks. For stronger protection, dedupe on the provider's event ID: store seen IDs and drop repeats, since providers retry the same event and at-least-once delivery is guaranteed.

## Verify, Enqueue, Then Ack Fast
Do the minimum synchronously: verify signature, dedupe, persist the raw event, enqueue a job, return 2xx. Never run business logic, call other services, or block on the DB inside the request — slow acks trigger sender timeouts and a retry storm. Return 200 only after the event is durably stored or enqueued, so a crash mid-processing causes a safe redelivery rather than silent loss.

## Make Handlers Idempotent and Order-Tolerant
Retries mean every handler runs more than once; key all effects on the event ID. Webhooks arrive out of order, so never assume sequence — use the event's own version/timestamp or refetch current state from the provider's API rather than mutating from a possibly-stale payload. For strict ordering needs, partition the queue by resource ID.

## Return the Right Status
2xx means accepted; the sender stops retrying. Return non-2xx only when you genuinely want a retry. A malformed-but-authentic event should be parked in a dead-letter queue and acked, not retried forever. Log the event ID and type for every receipt.

## When to Skip
Internal, mutually-authenticated service-to-service calls over mTLS may not need HMAC. But any third-party-originated webhook, even in staging, gets full signature verification — never disable it for convenience.
