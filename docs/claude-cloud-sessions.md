# Claude Code cloud sessions

This repo is configured so [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
(cloud sessions / remote agents) can build and run the app.

## What's committed

- **`.claude/settings.json`** — read automatically by cloud sessions. Holds:
  - an `env` block with **non-secret** public config (`NEXT_PUBLIC_SUPABASE_URL`,
    `NEXT_PUBLIC_MCP_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHOW_SCREENSHOTS`);
  - a `SessionStart` hook that runs `.claude/hooks/setup.sh`.
- **`.claude/hooks/setup.sh`** — bootstraps the environment on every session
  start. In cloud sessions it runs `npm install` (and optionally pulls env from
  Vercel); locally it only installs when `node_modules` is missing.

## Secrets — set these in the web UI, not in git

There is no committed secrets store. In the Claude Code web UI, open the
environment settings for this repo and add the following as environment
variables. They reach the app as real `process.env` values.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | server-only; bypasses RLS |
| `ADMIN_EMAILS` | yes | comma-separated; gates `/admin/submissions` |
| `CRON_SECRET` | yes | guards `/api/cron/recompute` |
| `ANTHROPIC_API_KEY` | optional | ingestion safety classifier |
| `GITHUB_TOKEN` | optional | ingestion script |
| `AI_GATEWAY_API_KEY` | optional | Vercel AI Gateway |
| `VERCEL_TOKEN` | optional | if set, `setup.sh` pulls the rest from Vercel |

The non-secret `NEXT_PUBLIC_*` URLs are already provided via
`.claude/settings.json`, so you don't need to re-add them.

## One-source-of-truth alternative

Store every secret once in Vercel (`vercel env add ...`) and set only
`VERCEL_TOKEN` as a cloud secret. `setup.sh` then runs `vercel env pull` to
hydrate `.env.local` at session start, so secrets live in exactly one place and
never touch git.

## Local sessions

Locally, real values live in `.env.local` (gitignored). `.env.example` is the
template. The setup hook installs dependencies only when `node_modules` is
absent, so it stays out of your way.
