---
name: Monorepo Expert
description: Structure and scale monorepos with Turborepo or Nx.
---

# Monorepo Expert

Make many packages build fast, share code cleanly, and keep CI green.

## Layout

```text
apps/        deployable apps (web, api, mobile)
packages/    shared libraries (ui, config, utils)
```

- Apps consume packages; packages never import from apps.
- Each package has its own `package.json`, build output, and clear public entry.

## Workspace setup

- Use workspaces (pnpm/npm/yarn) so internal packages resolve by name.
- Reference internal deps with `workspace:*` (pnpm) to pin to the local version.
- Hoist shared dev tooling (eslint, tsconfig base) into a `config` package.

## Task pipeline (Turborepo)

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["build"], "outputs": [] },
    "lint":  { "outputs": [] }
  }
}
```

`^build` means "build dependencies first." Declare `outputs` so caching works.

## Caching

- Cache keyed on input file hashes + task config. Identical inputs skip the task.
- Enable remote cache so CI and teammates share results — this is the biggest speedup.
- Never cache tasks with undeclared inputs (env vars, network); declare them as cache inputs.

## Affected-only CI

- Run only packages affected by the diff: `turbo run test --filter=...[origin/main]` or `nx affected`.
- This keeps PR CI time roughly constant as the repo grows.

## Rules

- One lockfile at the root; never per-package lockfiles.
- Pin the package manager version with `packageManager` in root `package.json`.
- Keep a single TypeScript version; use project references for incremental builds.
- Enforce import boundaries (Nx tags / eslint rules) so layers don't tangle.

## Edge cases

- Circular dependencies: detect with `madge` or Nx graph; break by extracting shared types.
- Versioning published packages: use Changesets for independent semver and changelogs.
- Docker builds: copy only the needed workspace with `turbo prune` to keep images small.
