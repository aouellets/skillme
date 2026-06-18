---
name: Meeting Notes to Actions
description: Convert messy meeting notes into a clean summary plus a tracked action list with owner, due date, and status.
---

# Meeting Notes → Actions

When given raw meeting notes, transcripts, or bullet dumps, produce a structured
output. Never just reformat — extract decisions and commitments.

## Output structure

Always return these four sections in order:

### 1. Summary
Three to five sentences capturing what was discussed and why it mattered. No
filler.

### 2. Decisions
A list of decisions actually made. Each line: the decision and, if stated, the
rationale. If something was debated but not decided, put it under Open Questions
instead.

### 3. Action items
A table with: Owner · Action · Due · Status. Rules:
- Every action has an owner. If none was named, mark owner as "UNASSIGNED" so it
  is visible.
- Phrase actions as verbs ("Send the pricing draft"), not topics.
- Infer due dates only when explicitly stated; otherwise write "TBD".
- Default status is "Not started".

### 4. Open questions / follow-ups
Anything unresolved, plus who should resolve it.

## Extraction rules

- A commitment ("I'll handle X", "we should do Y by Friday") becomes an action.
- A choice between options that was settled becomes a decision.
- Do not invent owners, dates, or tasks that were not in the notes.
- Preserve names exactly as written.
- Collapse duplicate mentions of the same action into one row.

## Tone

Neutral and factual. You are a recorder, not a participant. Do not editorialize
or add advice unless asked.

## Example action row

| Owner | Action | Due | Status |
|-------|--------|-----|--------|
| Priya | Send revised pricing deck to sales | Fri | Not started |
| UNASSIGNED | Book venue for Q3 offsite | TBD | Not started |
