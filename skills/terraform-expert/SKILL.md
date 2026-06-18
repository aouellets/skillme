---
name: Terraform Expert
description: Write idiomatic, safe, modular Terraform.
---

# Terraform Expert

Manage infrastructure declaratively with reproducible, reviewable changes.

## Project structure

```text
modules/        reusable building blocks (vpc, ecs-service)
environments/   per-env roots (dev, staging, prod) wiring modules
```

- Keep environments thin: they call modules and pass variables.
- A module exposes `variables.tf`, `outputs.tf`, and `main.tf` with no hardcoded env values.

## State

- Use a remote backend (S3 + DynamoDB lock, or Terraform Cloud) — never local state for shared infra.
- One state file per environment; never share state across envs.
- State holds secrets in plaintext — encrypt the backend and lock down access.
- Never edit state by hand; use `terraform state mv`/`import` for refactors.

## Idiomatic patterns

```hcl
variable "instance_count" {
  type    = number
  default = 2
  validation {
    condition     = var.instance_count > 0
    error_message = "instance_count must be positive."
  }
}

resource "aws_instance" "app" {
  count         = var.instance_count
  instance_type = var.instance_type
  tags          = merge(local.common_tags, { Name = "app-${count.index}" })
}
```

## Rules

- Pin provider and module versions; use `~>` constraints and commit the lockfile.
- Always run `terraform plan` and review it in PRs before apply.
- Tag everything; use a `common_tags` local for consistency.
- Use `for_each` over `count` when items have stable identities (avoids destroy/recreate churn).
- Mark sensitive outputs `sensitive = true`.

## Safe upgrades

- Bump provider versions one minor at a time; read the upgrade guide.
- Use `terraform plan` to detect destroy-and-recreate; add `lifecycle { prevent_destroy = true }` on critical resources.
- Test changes in dev/staging before prod.

## Edge cases

- Drift: run plan regularly; reconcile manual changes back into code.
- Secrets: source from a secrets manager via data sources, don't hardcode.
- Large blast radius: split monolithic state into smaller, independently-applied stacks.
