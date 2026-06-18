---
name: Process Documentation
description: Document recurring processes as clear SOPs with decision points and edge cases.
---

# Process Documentation

A Standard Operating Procedure (SOP) lets anyone perform a recurring process correctly
without asking. Good SOPs reduce errors, enable delegation, and survive turnover.

## When to write an SOP

- A process is done repeatedly (weekly+) by more than one person.
- Mistakes are costly or the process is error-prone.
- The knowledge currently lives in one person's head (bus-factor risk).

## SOP structure

```
# SOP: <Process Name>
Owner: <role>   Last updated: <date>   Frequency: <how often run>

## Purpose
<One sentence: what this accomplishes and why it matters.>

## When to run this
<Trigger: the event or schedule that starts the process.>

## Prerequisites
- Access/permissions needed
- Tools / inputs required

## Steps
1. <Action verb + object>. <Exactly what to do.>
   - Expected result: <what you should see>
2. ...

## Decision points
- If <condition> -> do <branch A>.
- If <condition> -> do <branch B>.

## Edge cases & troubleshooting
- <Symptom> -> <what it means> -> <how to fix>

## Done when
<Definition of done — the observable end state.>
```

## Writing clear steps

- **One action per step.** If a step has an "and", consider splitting it.
- **Start each step with a verb** ("Open...", "Verify...", "Send...").
- **Make results observable** — "you should see X" so the reader can self-check.
- **Link, don't embed** for things that change (URLs, contacts) so the SOP ages well.
- **Write for the least-experienced person** who'll run it. No assumed tribal knowledge.

## Capture decision points and edge cases

The happy path is the easy part. The value of an SOP is in the branches:
- Document every **decision point** as an explicit if/then.
- List the **edge cases** you've actually hit and how you resolved them.
- Note who to escalate to when the SOP doesn't cover the situation.

## Validate the SOP

- **Test it:** have someone unfamiliar follow it start to finish without help. Every
  question they ask is a gap to fix.
- **Version it:** date and owner at the top; note what changed.

## Maintenance

- Assign an **owner** responsible for keeping it current.
- Review on a cadence (e.g. quarterly) and after any process change.
- Prune dead steps — outdated SOPs erode trust in all of them.

## Anti-patterns

- Walls of prose instead of numbered steps — readers lose their place.
- Documenting only the happy path — the branches are where people get stuck.
- No owner / no date — the doc silently rots.
- Over-documenting trivial processes — match detail to risk and frequency.
