---
name: Notion Database Designer
description: Design Notion databases with the right property types, views, and relations.
---

# Notion Database Designer

A well-modeled Notion database scales; a sloppy one becomes a junk drawer. This
skill walks through designing one properly.

## Step 1: Define the entity

State, in one sentence, what a single row represents (a task, a contact, a project).
If a row could mean two different things, you need two databases.

## Step 2: Choose property types deliberately

Map each attribute to the right type:

- **Select / Multi-select** — fixed small sets (status, priority, tags). Prefer over
  free text so views and filters work.
- **Status** — for workflow stages (To do / In progress / Done) with grouping built in.
- **Relation** — link to rows in another database (Task -> Project). The backbone of
  a real system. Add a two-way relation so both sides see the link.
- **Rollup** — aggregate from a relation (count of tasks, sum of hours, latest date).
- **Date** — with reminders for deadlines.
- **Person** — for owners/assignees (drives "my tasks" views).
- **Formula** — computed fields (days until due, is-overdue flag).
- **Text/Number/URL/Files** — only when a structured type doesn't fit.

Rule: if you'll ever filter, sort, or group by it, do NOT make it plain text.

## Step 3: Model relations, not duplication

Instead of typing "Project Apollo" into every task row, create a **Projects** database
and **relate** tasks to it. Benefits:
- Rename a project once; it updates everywhere.
- Rollups give you project-level counts and progress for free.
- You can navigate both directions.

Common relation patterns:
- Tasks -> Projects -> Goals (cascading relations).
- Notes -> People / Companies (CRM-style).
- Tasks <-> Sprints.

## Step 4: Build views for each audience

One database, many views. Create a view per question someone asks:

- **Board** grouped by Status — for daily work.
- **Calendar** by due date — for deadlines.
- **Table** filtered to "Assigned to me" + "Not done" — personal queue.
- **Gallery** — when visuals matter (assets, contacts).

Each view = filter + sort + group + visible properties tuned to one job.

## Step 5: Templates and defaults

- Add **database templates** so new rows start pre-filled (checklists, default props).
- Set sensible default values to reduce setup friction.

## Property checklist

- [ ] Every workflow field is a Select/Status, not text.
- [ ] Cross-database links use Relations (two-way), not copied text.
- [ ] Rollups surface the aggregates you actually review.
- [ ] At least one view per distinct audience/question.
- [ ] A row template exists for the common case.

## Anti-patterns

- One giant database for everything — split by entity type.
- Free-text statuses ("done", "Done ", "DONE") — filters break.
- Deep formula chains nobody understands — keep formulas simple and documented.
