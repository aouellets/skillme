---
name: Design Critique
description: Run a structured design critique across jobs-to-be-done, clarity, and delight.
---

# Design Critique

Use this skill to give a designer or PM a rigorous, structured critique of a screen,
flow, or component. Avoid vague reactions ("I don't like it") and instead anchor every
note to a dimension and a concrete fix.

## When to use

- A new design or redesign is up for review.
- A flow feels "off" but no one can articulate why.
- You need to prioritize design debt against shipping goals.

## Before you start

Gather three things first. If any is missing, ask for it before critiquing:

1. The primary **job** the user is hiring this design to do.
2. The **context** of use (device, urgency, frequency, emotional state).
3. The **success metric** the team cares about.

## The three dimensions

### 1. Jobs-to-be-done (does it work?)

- Restate the user's job in one sentence.
- Trace the shortest path from intent to completion. Count the steps.
- Flag any step that does not advance the job.
- Check failure paths: what happens when input is wrong, empty, or slow?

### 2. Clarity (can they understand it?)

- Read the screen top to bottom in 5 seconds. What is the one obvious action?
- Verify visual hierarchy matches task priority (size, weight, color, position).
- Check labels: are they written in the user's language, not the system's?
- Test for ambiguity — could any control be misread as something else?

### 3. Delight (do they enjoy it?)

- Identify one moment that could feel effortless or rewarding.
- Check motion, microcopy, and empty states for personality without noise.
- Ensure delight never costs clarity or speed.

## Output format

Produce a critique table. For each finding:

| Dimension | Severity | Observation | Suggested fix |
|-----------|----------|-------------|---------------|

Severity scale:

- **Blocker** — breaks the job, ship-stopping.
- **Major** — measurable friction, fix this cycle.
- **Minor** — polish, backlog it.

## Rules of engagement

- Lead with what works before what doesn't.
- Separate observation from prescription — describe the problem, then propose.
- Never give more than 3 blockers per critique; if there are more, the design needs a reset, not a critique.
- Tie every Major and Blocker to the success metric or the job.

## Closing

End every critique with a single prioritized recommendation: "If you change one
thing before shipping, change X." This forces focus and gives the team a clear next step.
