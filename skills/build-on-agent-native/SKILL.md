---
name: Build on Agent-Native
description: Build an application on Builder.io's open-source Agent-Native framework (@agent-native/core) — the model where the agent acts inside the app as a first-class peer to the UI, sharing one set of actions and one database with the interface. Covers the core primitives (actions as the single source of truth, SQL-backed shared state, real-time sync, context-awareness, agent-to-agent, automations, the skills convention), the CLI and cloneable-template workflow, and where to read version-matched docs. Use when someone says "build an agent-native app", "use the agent-native framework", "defineAction", "@agent-native/core", "clone an agent-native template", "make the agent a peer to my UI", or "an app where the agent and the UI call the same actions". Do NOT use for authoring generic Claude Agent Skills / SKILL.md files — that is skill-creator; do NOT use for building a standalone MCP server unrelated to this framework — that is the MCP-builder path; do NOT use for plain Next.js / React scaffolding with no agent runtime.

---

# Build on Agent-Native

Agent-Native (open-source, MIT, by Builder.io — `@agent-native/core`) is a framework for apps where the agent acts **inside** the product, not in a chat box beside it. The agent and the UI are equal citizens of one system: the same action that a button calls, the agent calls as a tool, over the same database and shared state. Use this skill to build on it correctly instead of bolting a chatbot onto a normal app.

## When to reach for it

Choose Agent-Native when the agent needs to *do real work in the product* — read and mutate app data, edit the same document a human is editing, coordinate with other agents — and you want one implementation serving UI, agent, HTTP, MCP, A2A, and CLI. If you only need a chat assistant next to an otherwise-normal app, you do not need this framework; say so.

## Core primitives

**Actions are the single source of truth.** Define each operation once with `defineAction` (a Zod schema plus a `run` function). That one definition is callable from the agent as a tool, from the UI via `useActionQuery` / `useActionMutation`, and from HTTP, MCP, A2A, and the CLI (`pnpm action <name>`). Do not add `/api/*` pass-through routes whose only job is to call an action — call the action directly.

**Keep the action surface small and orthogonal.** Every agent-exposed action is a tool in the model's context window, and more tools degrade tool-selection quality. Prefer one patch-style `update-<thing>` over many per-field actions. Hide UI-only or programmatic actions from the model with `agentTool: false` (still callable from the UI/HTTP, just not a tool the agent sees). Note that `agentTool: false` (hidden from the model entirely) is *not* `toolCallable: false` (blocks only the sandboxed extension iframe bridge) — use the latter for high-blast-radius operations, not for trimming the tool list.

**SQL-backed shared state.** Bring your own Drizzle-supported SQL database and a Nitro-compatible host. One database, one state — changes from the agent or the UI show up instantly on the other via real-time sync. This is what makes human-and-agent multiplayer editing work.

**Context-awareness.** The agent knows what the user is looking at. Surface UI state to it deliberately so "summarize *this*" and Cmd+I-style "do this to the selection" work.

**Agent-to-agent (A2A) and external agents.** Agents tag and call other agents over A2A; the framework also speaks MCP (as server and via MCP-apps). Reach for these for cross-app coordination rather than hardcoding integrations.

**Automations and recurring jobs.** Scheduled and triggered work runs through the framework's automations/jobs primitives, not ad-hoc cron glued on the side.

**The skills convention.** Agent instructions live as `SKILL.md` files under `.agents/skills/`. Author them with trigger-precise descriptions and imperative bodies (see the `skills-guide` and `writing-agent-instructions` docs).

## Start from a template, don't scaffold

Each official template is a complete, free, open-source SaaS app you **clone and own** — not a thin scaffold. Pick the closest one and customize: Calendar, Content (MDX), Plans, Mail, Chat, Forms, Slides, Videos, Clips, Brain, Analytics, Design, Dispatch, and more. Starting from the nearest template saves you the wiring and shows the conventions in context.

## Read version-matched docs — do not trust memory

The framework moves; a generated app may be on a different version than public docs or model memory. The installed package is the source that matches the app in front of you. From a generated app directory:

```bash
pnpm action docs-search --query "<feature>"   # search
pnpm action docs-search --slug <slug>          # read one doc
pnpm action docs-search --list                 # list slugs
```

Useful slugs: `actions`, `client`, `database`, `authentication`, `security`, `sharing`, `context-awareness`, `automations`, `recurring-jobs`, `a2a-protocol`, `external-agents`, `mcp-protocol`, `mcp-apps`, `skills-guide`, `writing-agent-instructions`. If the action runner is unavailable, read `node_modules/@agent-native/core/docs/AGENTS.md` and the files under `docs/content/` directly. Confirm any non-trivial API against these before implementing.

## Don't

- Don't add REST/API routes that merely wrap an action — call the action.
- Don't mint a new read action for every query shape; reach for a generic query / `provider-api` escape hatch first.
- Don't expose UI-only or high-blast-radius actions to the model — use `agentTool: false` / `toolCallable: false` appropriately.
- Don't answer framework API questions from memory when version-matched package docs are present — `docs-search` first.
- Don't use this skill to author standalone SKILL.md files (skill-creator) or to build an unrelated MCP server (MCP-builder).
