---
name: Jira Ticket Writer
description: Write clear Jira stories with acceptance criteria, subtasks, and point guidance.
---

# Jira Ticket Writer

A good ticket is understandable by someone who wasn't in the conversation. This
skill produces stories that are ready to estimate and build.

## Story format

Use the user-story shape for the summary, and a structured description:

```
Summary: As a <user>, I want <capability> so that <benefit>

Description:
## Context
<Why now? What problem does this solve? Link to the source.>

## Acceptance Criteria
- [ ] Given <state>, when <action>, then <result>
- [ ] Given <edge case>, when <action>, then <result>

## Out of scope
- <explicitly not included>

## Notes / Design
<links to designs, API contracts, decisions>
```

## Acceptance criteria rules

- Write them as **testable** statements — Given/When/Then or a checkbox list QA can verify.
- Cover the happy path AND key edge cases (empty state, errors, permissions).
- If a criterion can't be verified objectively, rewrite it until it can.
- "Done" = all criteria pass. No criterion = no shared definition of done.

## Subtasks

Break a story into subtasks when:
- It spans more than ~1-2 days of work.
- Multiple people or skills are involved (backend + frontend + QA).

Each subtask should be independently completable and named with an action verb
("Add migration for X", "Wire up Y endpoint"). Avoid subtasks so small they're noise.

## Story points

Estimate **relative effort/complexity/uncertainty**, not hours. Use a Fibonacci-ish
scale and a reference story:

- **1** — trivial, well-understood, < half a day.
- **2-3** — small, clear, no unknowns.
- **5** — medium; some complexity or coordination.
- **8** — large or uncertain; consider splitting.
- **13** — too big; split it before committing.

If the team can't agree within one or two points, the story is under-specified —
discuss and clarify, don't average.

## Definition of Ready (before pulling into a sprint)

- [ ] Summary follows the user-story format.
- [ ] Acceptance criteria are testable and cover edge cases.
- [ ] Dependencies and out-of-scope are noted.
- [ ] Designs/contracts linked if needed.
- [ ] Estimated and small enough to finish in a sprint.

## Anti-patterns

- "Fix the thing" tickets with no context — unbuildable a week later.
- Acceptance criteria that restate the title instead of defining behavior.
- 13+ point stories committed as-is — they always slip.
- Estimating in hours and calling them points.
