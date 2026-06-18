---
name: Second Brain
description: Stand up a PARA-based second brain with reliable capture, linking, and recall.
---

# Second Brain

A second brain is an external, trusted system for everything you want to remember
and act on. This skill sets one up using the PARA method in any notes app
(Notion, Obsidian, Apple Notes, Logseq).

## The PARA model

Organize every note into one of four top-level buckets, ordered by actionability:

- **Projects** — short-term efforts with a goal and a deadline (e.g. "Ship Q3 launch").
- **Areas** — ongoing responsibilities with a standard to maintain (e.g. "Health", "Finances").
- **Resources** — topics of interest for future reference (e.g. "Prompt engineering").
- **Archives** — inactive items from the other three buckets.

Rule: a note lives where you will next *act* on it, not where it topically "belongs".

## The four workflows

### 1. Capture

Lower friction to near zero. Set up one universal inbox note or quick-capture
shortcut. Capture anything: ideas, links, quotes, tasks. Do NOT organize at capture
time — speed beats structure here.

### 2. Organize (weekly)

Once a week, empty the inbox. For each item:
- Is it actionable now? -> attach to a **Project**.
- Is it an ongoing standard? -> file under an **Area**.
- Might it be useful later? -> **Resource**.
- Otherwise -> delete or **Archive**.

### 3. Link

Connect notes so recall works by association, not folders:
- Add 2-3 `[[wiki-links]]` or relations to related notes when you file something.
- Maintain a few **index/MOC** (map of content) notes that link out to clusters.
- Tag sparingly — links beat tags for retrieval.

### 4. Recall (Express)

The point of the system is output. When starting work:
- Search the relevant Project/Area note first.
- Follow links outward to gather supporting Resources.
- Distill into a working draft. Progressive summarization: bold the best lines,
  highlight the best of the bold.

## Note template

```
# <Title>
Bucket: Projects | Areas | Resources | Archives
Created: <date>
Links: [[related-1]] [[related-2]]

## Summary
<2-3 sentence why-this-matters>

## Notes
<content>

## Next action
<the single next step, if any>
```

## Maintenance rituals

- **Weekly review (20 min):** empty inbox, mark finished projects, archive the dead.
- **Monthly (10 min):** promote hot Resources, prune stale links.

## Anti-patterns to avoid

- Over-tagging or building deep folder trees — PARA stays flat (4 levels max).
- Collecting without expressing — capture is only valuable if you later create.
- Organizing at capture time — it kills capture velocity.
