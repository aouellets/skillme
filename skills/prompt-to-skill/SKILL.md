---
name: Prompt to Skill
description: Converts a repeated prompt or workflow into a reusable SKILL.md. Use when a user runs a prompt frequently, wants to share a workflow, or has a recurring task pattern across projects.
---

# Prompt to Skill

Takes a prompt a user runs over and over and packages it into a skill that any Claude agent can load, discover, and execute consistently.

## Step 1 — Extract the Pattern

Before writing a single line of SKILL.md, answer:
1. What is the one-sentence job this prompt does?
2. What are the exact inputs the user provides each time?
3. What does a successful output look like?
4. When would someone reach for this? Name three concrete trigger phrases.

If the original prompt handles more than one job, split it into multiple skills.

## Step 2 — Distill Into Sections

Map the original prompt to skill sections:
- Procedural steps become H2 sections with numbered lists
- Heuristics and rules of thumb become do/don't pairs
- Examples from the original prompt become inline examples
- Conditional logic ('if X then Y') becomes explicit escape hatches

Do not preserve prompt padding ('Please', 'Make sure to', 'Always remember'). Keep the rule, drop the filler.

## Step 3 — Write Frontmatter Last

Write the description after the body, not before. Once the sections are clear, the WHAT and WHEN are obvious. The description should reference the trigger phrases from Step 1.

## Step 4 — Trim

Target 900 to 3000 chars total. If the original prompt was long, the extra length usually came from examples and hedging. Keep one representative example per section, delete the rest. Remove any instruction that duplicates Claude's default behavior.

## Checklist

- One job per skill (split if needed)
- Frontmatter name and description valid
- No backtick characters, no code fences
- Inputs and outputs are explicit
- Total length 900 to 3000 chars
