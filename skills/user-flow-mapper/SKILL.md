---
name: User Flow Mapper
description: Map complete user flows including happy path, errors, edge cases, and re-engagement.
---

# User Flow Mapper

Use this skill to map a feature's full flow before design or build — surfacing the
error and edge states teams usually discover too late.

## Step 1: Frame the flow

State three things:

- **Entry points** — every way a user can arrive (deep link, nav, notification, search).
- **Goal** — the single outcome that means success.
- **Actors and pre-conditions** — who, with what permissions and prior state.

## Step 2: Map the happy path

List the minimal sequence of steps from entry to goal when everything works. Use
verb-led step names: "Enter email", "Verify code", "Set password". Keep it linear
and short; this is the spine everything else hangs from.

## Step 3: Branch the decision points

At each step, ask "what can the user choose or what can the system decide here?"
Draw branches for each. Common branch types:

- Validation outcomes (valid / invalid input)
- Permission checks (allowed / denied)
- Existence checks (new / returning, exists / not found)

## Step 4: Enumerate error states

For every step that can fail, define:

- **Trigger** — what causes the error.
- **Message** — what the user sees (blame-free, actionable).
- **Recovery** — the path back to the happy path.

Cover at minimum: network failure, timeout, server error, invalid input, and
permission denial.

## Step 5: Edge cases checklist

Walk this list against every flow:

- Empty states (no data yet) and overflow states (too much data).
- Slow connection / partial load.
- Interrupted flow (user leaves and returns mid-flow).
- Concurrent edits or stale data.
- First-time vs power user.
- Boundary inputs: zero, maximum length, special characters, time zones.
- Accessibility paths: keyboard-only and screen-reader traversal.

## Step 6: Re-engagement and exits

A flow doesn't end at the goal. Map:

- **Success exit** — what's next? Confirmation, next action, or dead end?
- **Abandonment** — if the user drops, how do you bring them back (email, push, saved progress)?
- **Loops** — can they repeat the flow easily?

## Step 7: Notate the map

Use a consistent visual grammar:

- Rectangle = screen/step, diamond = decision, rounded = system process,
  red = error state, dashed = re-engagement path.
- Number steps for reference in specs and tickets.

## Output

Deliver the flow diagram (or structured outline) covering happy path, all branches,
error states with recovery, the edge-case audit, and re-engagement paths. Flag the
top three risks where the flow is most likely to break for users.
