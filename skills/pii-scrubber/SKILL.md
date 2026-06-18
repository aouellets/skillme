---
name: PII Scrubber
description: Detect and redact PII from text, logs, and data.
---

# PII Scrubber

Find and remove personally identifiable information before it leaks into logs, prompts, or analytics.

## Categories to detect

Names, emails, phone numbers, postal addresses, government IDs (SSN, passport), dates of birth, credit card / bank account numbers, IP addresses, MAC addresses, geolocation, biometric refs, medical record numbers, vehicle plates, usernames, device IDs, URLs with tokens, and free-text quasi-identifiers.

## Detection strategy

1. Deterministic patterns for structured PII (regex + checksums).
2. Validate where possible — Luhn for cards, format checks for SSN/IBAN — to cut false positives.
3. Named-entity recognition for names, locations, and organizations in free text.
4. Context rules: a 9-digit number near "SSN" is higher-confidence than one standalone.

```text
email:  [^\s@]+@[^\s@]+\.[^\s@]+
card:   \b(?:\d[ -]?){13,16}\b   then Luhn-validate
ipv4:   \b\d{1,3}(\.\d{1,3}){3}\b
```

## Redaction modes

- Mask: `j***@example.com`, `****-****-****-1234` (keep last 4 for support).
- Tokenize: replace with a stable pseudonym so records still join (`USER_a1b2`).
- Hash: one-way for analytics where you only need equality.
- Remove: drop the field entirely when it's not needed.

Pick based on downstream need; default to the most aggressive that still works.

## Rules

- Scrub at the boundary: before logging, before sending to third parties, before LLM prompts.
- Keep an allowlist of fields safe to log rather than a blocklist of bad ones.
- Make tokenization deterministic with a secret salt so the same value maps consistently — and rotate carefully.
- Never log the raw value alongside the redacted one.

## Compliance notes

- GDPR/CCPA: support deletion and access requests — tokenization helps you find all records.
- Minimize: don't collect or retain PII you don't need.
- Audit: log that redaction ran, not what it redacted.

## Edge cases

- False negatives in free text (typos, unusual formats) — combine NER with patterns and review samples.
- Quasi-identifiers: combinations (zip + DOB + gender) can re-identify; consider k-anonymity for datasets.
- Internationalization: phone/ID formats vary by country; use locale-aware validators.
