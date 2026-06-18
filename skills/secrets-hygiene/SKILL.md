---
name: Secrets Hygiene
description: Guides detection, remediation, and prevention of leaked secrets and credentials across source code, CI pipelines, logs, and config. Load when a secret may have been exposed or when reviewing secrets management practices.
---

# Secrets Hygiene

A leaked secret is a live incident until rotated. Treat any suspected exposure as confirmed until proven otherwise — the cost of unnecessary rotation is always lower than the cost of a breach.

## Immediate Response to a Suspected Leak

In order, without delay:
1. Rotate the credential immediately through the issuing system (cloud console, API portal, identity provider). Do not wait to confirm exposure first.
2. Revoke any active sessions or tokens derived from the compromised credential.
3. Scan audit logs for the credential's usage over the prior 90 days to assess blast radius.
4. Assess whether the secret was committed to a git repo — if yes, treat the full history as compromised even after deletion, because git history is persistent and forks may exist.

## Detection: Finding Secrets in Code and Config

Run a secret scanner across the full git history, not just HEAD. Recommended tools: trufflehog (history-aware), gitleaks, or detect-secrets. Configure patterns for your stack's credential formats (AWS AKIA prefixes, GCP service account JSON keys, Stripe sk_live_ prefixes, PEM headers).

Also scan: CI/CD pipeline logs (they frequently echo env vars), Terraform state files, Docker image layers, and Kubernetes configmaps/secrets stored in plaintext.

## Secure Storage Patterns

The right store depends on the runtime:
- Local development: use a .env file listed in .gitignore plus a .env.example with placeholder values. Never commit real values.
- CI/CD: use the platform's native secret store (GitHub Actions encrypted secrets, GitLab CI variables, etc.). Never interpolate secrets into log output.
- Application runtime: use a dedicated secrets manager (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager). Fetch at runtime, not at build time. Prefer short-lived credentials with automatic rotation over long-lived API keys.
- Kubernetes: use external secrets operators to sync from a secrets manager rather than storing values in etcd via native Secrets objects.

## Prevention Controls

- Install a pre-commit hook that runs a secret scanner before every commit (pre-commit framework with detect-secrets or gitleaks).
- Add the scanner to CI as a required check that blocks merge on findings.
- Set minimum IAM permissions for every credential — a leaked read-only key is less damaging than a leaked admin key.
- Enforce secret expiry: no credential should live longer than 90 days without automated rotation.

## What Not to Do

- Do not base64-encode a secret and consider it safe — encoding is not encryption.
- Do not store secrets in environment variable files that are committed to source control, even in non-production branches.
- Do not log request headers or POST bodies at INFO level — auth tokens and API keys appear there routinely.
