---
name: GitHub Actions
description: Write fast, secure CI/CD with GitHub Actions.
---

# GitHub Actions

Build pipelines that are fast, cached, and secure.

## Workflow basics

```yaml
name: CI
on:
  pull_request:
  push: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm test
```

## Caching

- Use the built-in cache in `setup-node`/`setup-python` for dependencies — biggest, easiest win.
- For custom caches, use `actions/cache` keyed on a lockfile hash with a restore-keys fallback.
- Cache build outputs (Turborepo/Nx remote cache) to skip unchanged work.

## Matrix builds

```yaml
strategy:
  fail-fast: false
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, macos-latest]
```

- Use matrices to test across versions/OS in parallel.
- Set `fail-fast: false` when you want all combinations to report.

## Speed

- Run independent jobs in parallel; use `needs` only for real dependencies.
- Only build what changed with path filters or affected-detection.
- Pin to specific runners; avoid reinstalling toolchains you can cache.

## Security

- Pin third-party actions to a full commit SHA, not a mutable tag.
- Set least-privilege `permissions:` (default to read-only) per workflow/job.
- Never echo secrets; pass them via `secrets` context, not `run` args.
- Be cautious with `pull_request_target` — it runs with write tokens against untrusted code.

## Deployment

- Use environments with required reviewers and protection rules for prod.
- Prefer OIDC to assume cloud roles instead of long-lived cloud keys.
- Gate deploys on passing tests via `needs`.

## Rules

- Keep workflows DRY with reusable workflows and composite actions.
- Use concurrency groups to cancel superseded runs on the same branch.
- Fail loudly; don't `|| true` away real failures.

## Edge cases

- Forked PRs: secrets aren't available — design CI to run safely without them.
- Flaky tests: quarantine and fix; don't blanket-retry green.
- Monorepo: trigger jobs by changed paths to keep CI fast.
