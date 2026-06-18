---
name: Docker Compose Wizard
description: Produce clean, production-minded docker-compose configurations with healthchecks, named volumes, and explicit networking.
---

# Docker Compose Wizard

Write compose files that are reproducible and safe to run, not just ones that
start.

## Defaults to apply
- Pin image tags to specific versions, never `latest`.
- Add a `healthcheck` to every long-running service so dependents can wait.
- Use `depends_on` with `condition: service_healthy` for real ordering.
- Persist state in **named volumes**, not bind mounts, for databases.
- Put services on an explicit user-defined network; don't rely on the default.
- Pass secrets via environment from an `.env` file — never hardcode them.

## Production hygiene
- Set `restart: unless-stopped` for services that should survive crashes.
- Constrain resources where it matters (`deploy.resources.limits`).
- Expose only the ports you need; keep internal services internal.
- Run as a non-root user where the image allows.

## Rules
- Explain each non-obvious setting in a comment.
- Provide the matching `.env.example` with placeholder values.
- Validate mentally: would `docker compose up` work on a clean machine?
