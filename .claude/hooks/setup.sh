#!/usr/bin/env bash
#
# Skill Me — Claude Code session bootstrap.
# Runs on every session start/resume (local AND cloud) via the SessionStart
# hook in .claude/settings.json.
#
#   - Cloud sessions (CLAUDE_CODE_REMOTE=true): full bootstrap so a fresh
#     environment can build and run the app.
#   - Local sessions: stays out of the way; only installs if deps are missing.
#
# SECRETS: this file is committed, so it must NOT contain any. Provide the
# secret env vars below in the Claude Code web UI -> environment settings
# (they arrive as real process env vars). Non-secret public config lives in the
# "env" block of .claude/settings.json.
#
# Required secret vars for full functionality:
#   NEXT_PUBLIC_SUPABASE_ANON_KEY   - Supabase anon/publishable key (client reads)
#   SUPABASE_SERVICE_ROLE_KEY       - Supabase service role (server-only; bypasses RLS)
#   ADMIN_EMAILS                    - comma-separated admin emails for /admin/submissions
#   CRON_SECRET                     - guards /api/cron/recompute
# Optional:
#   ANTHROPIC_API_KEY, GITHUB_TOKEN, AI_GATEWAY_API_KEY
#   VERCEL_TOKEN                    - if set, secrets are pulled from Vercel instead
#
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

install_deps() {
  echo "[skillshelf] installing dependencies"
  npm install --no-audit --no-fund
}

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  echo "[skillshelf] cloud session — bootstrapping"
  install_deps

  # One source of truth: if a Vercel token is configured as a cloud secret,
  # hydrate .env.local from Vercel. Otherwise rely on env vars set in the web UI.
  if [ -n "${VERCEL_TOKEN:-}" ]; then
    echo "[skillshelf] pulling environment from Vercel"
    npx --yes vercel@latest env pull .env.local \
      --environment=development --yes --token "$VERCEL_TOKEN" \
      && echo "[skillshelf] env pulled from Vercel" \
      || echo "[skillshelf] vercel env pull skipped/failed — using env from web UI settings"
  fi
elif [ ! -d node_modules ]; then
  install_deps
fi

exit 0
