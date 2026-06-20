---
name: Skill Tester
description: Empirically tests a skill with subagent scenarios to verify it triggers correctly and performs its job. Use when validating a new or modified SKILL.md before publishing or adding it to a pack. Do NOT use to statically grade or rewrite skill quality (use Skill Auditor) — this runs live trigger tests.
---

# Skill Tester

Verifies that a skill fires on the right prompts, stays silent on unrelated ones, and actually produces the behavior its description promises.

## Two Test Dimensions

Test both triggering and performance separately:
- Trigger tests: does the skill activate on the intended prompts? Does it stay silent on out-of-scope prompts?
- Performance tests: when activated, does it follow the skill instructions and produce correct output?

## Writing Trigger Scenarios

For each skill under test, write at least three positive scenarios (prompts that should trigger it) and two negative scenarios (prompts that should not). Positive scenarios should paraphrase the WHEN clause of the description using different words. Negative scenarios should be adjacent tasks that the skill should not hijack.

Example for a 'Skill Author' skill:
- Positive: 'Write a new skill for generating database migrations'
- Positive: 'Help me create a SKILL.md for a code-review capability'
- Negative: 'Review my pull request' (that is a different skill)
- Negative: 'What is the weather today'

## Running Subagent Tests

Launch each scenario as a subagent with the target skill loaded. Capture: did the skill load, did the agent follow the skill sections, was the output format correct. Run positive and negative scenarios in the same batch where the subagent framework supports it.

## Pass Criteria

- All positive scenarios trigger the skill
- All negative scenarios do not trigger the skill
- Output for at least two positive scenarios satisfies the skill checklist
- No frontmatter parsing errors

## Iteration Loop

If trigger tests fail: revise the description WHEN clause and add missing trigger terms. If performance tests fail: revise the skill body sections for the failing behavior. Re-run after each revision. Do not publish until all scenarios pass.
