---
name: Linear Workflow
description: Configure Linear teams with cycles, labels, SLAs, and a clean triage workflow.
---

# Linear Workflow

Linear rewards lightweight, opinionated process. This skill sets up a team so issues
flow predictably from idea to done.

## Step 1: Team structure

- Create one **team per delivery unit** (a squad that ships together), not per function.
- Keep team identifiers short (e.g. `ENG`, `WEB`) — they prefix every issue.
- Avoid sprawling sub-teams early; split only when a team's backlog is unmanageable.

## Step 2: Workflow states

Keep states minimal and meaningful:

```
Backlog -> Todo -> In Progress -> In Review -> Done
                                        |
                                    Canceled
```

- **Backlog**: not yet committed.
- **Todo**: committed to the current cycle.
- **In Progress**: actively being worked (limit WIP — one or two per person).
- **In Review**: PR open / awaiting review.
- **Done / Canceled**: terminal.

## Step 3: Cycles (sprints)

- Enable **cycles** with a fixed cadence (1 or 2 weeks). Pick one and keep it.
- Let unfinished issues **auto-roll** to the next cycle so nothing is lost.
- Use cycle velocity (completed points/issues) to forecast, not to punish.
- Review the cycle graph at the end of each cycle for scope creep and carryover trends.

## Step 4: Labels

Use a small, structured label taxonomy. Group labels so they stay tidy:

- **Type**: `bug`, `feature`, `chore`, `tech-debt`.
- **Priority** is a built-in field — use it (Urgent/High/Med/Low), don't duplicate as labels.
- **Area**: `area/auth`, `area/billing` — for filtering by surface.

Resist label explosion; if a label isn't used in filters or views, drop it.

## Step 5: Triage

Turn on **Triage** for inbound issues (bugs, requests):

1. New issues land in Triage, unassigned.
2. A rotating triage owner reviews daily: validate, label, set priority, assign or
   move to Backlog/Todo — or close as won't-fix.
3. Nothing sits in Triage longer than one business day.

## Step 6: SLAs

Define response/resolution targets by priority and encode expectations:

- **Urgent**: ack < 1h, in progress same day.
- **High**: triaged < 1 day, in cycle within the week.
- **Medium/Low**: triaged < 3 days, scheduled when capacity allows.

Build saved views that surface SLA breaches (e.g. "Urgent + not started").

## Useful saved views

- "My active issues" (assignee = me, state = In Progress/In Review).
- "Needs triage" (state = Triage).
- "Cycle at risk" (current cycle + priority High/Urgent + not Done).

## Anti-patterns

- Too many workflow states — each one is a place issues go to die.
- Skipping triage — the backlog fills with unvalidated noise.
- Treating velocity as a target — it becomes gamed and meaningless.
