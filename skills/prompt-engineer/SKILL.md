---
name: Prompt Engineer
description: Build reliable, structured prompts for any LLM task.
---

# Prompt Engineer

Turn a vague request into a prompt that produces consistent, high-quality output.

## Process

1. Clarify the task. State the single objective in one sentence before writing anything.
2. Pick the four blocks: Role, Context, Task, Format. Every prompt should have them.
3. Add 1-3 examples (few-shot) when the output shape is non-obvious.
4. Specify the failure mode: what to do when input is missing or ambiguous.
5. Iterate on real inputs, not imagined ones.

## Structure to follow

```text
ROLE: You are a senior <domain> expert.
CONTEXT: <facts the model needs, constraints, audience>
TASK: <imperative, one goal>
FORMAT: Respond as <JSON schema / markdown table / bullets>.
RULES:
- If <field> is missing, return "UNKNOWN" rather than guessing.
- Keep reasoning internal; output only the final result.
```

## Rules

- Prefer positive instructions ("respond in JSON") over negative ones ("don't use prose").
- Put the most important constraint last; recency bias makes it stick.
- Pin output format with a literal schema or example, not a description.
- For classification, enumerate the exact allowed labels. Forbid new labels.
- Delimit user-supplied content with XML-style tags so injection can't blur boundaries.
- Ask for structured output (JSON) when a downstream system parses it; ask for markdown when a human reads it.

## Few-shot example

```text
Classify sentiment as POSITIVE, NEGATIVE, or NEUTRAL.

Input: "Shipping was fast but the box was crushed."
Output: NEGATIVE

Input: "Exactly what I expected."
Output: NEUTRAL

Input: ${userText}
Output:
```

## Edge cases

- Long context: place the question both before and after the documents.
- Refusals on benign tasks: add a one-line justification of legitimate intent.
- Inconsistent JSON: lower temperature, and validate with a schema; retry once on parse failure.
- Hallucinated facts: instruct "only use the provided context; cite the sentence."

## Anti-patterns

- "Be creative and detailed" with no constraints — produces unpredictable length.
- Stuffing ten tasks into one prompt — split into a chain.
- Relying on the model to remember format across a long conversation without restating it.
