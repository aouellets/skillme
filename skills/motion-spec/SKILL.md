---
name: Motion Spec
description: Specifies animation and motion precisely — duration, easing curve, trigger, and intent — for accurate engineer implementation. Use when handing off transitions, micro-interactions, or loading states.
---

# Motion Spec

Motion that is vaguely specified gets implemented incorrectly or skipped. Every animation needs five pieces of information: what moves, when it triggers, how long it takes, what easing curve it follows, and why it exists. Provide all five.

## The Five Required Fields

For every animated element, document:
1. Element: the component or property being animated (e.g. 'modal overlay opacity', 'button background color').
2. Trigger: the event that starts the animation (e.g. 'user clicks confirm', 'data fetch resolves', 'component mounts').
3. Duration: in milliseconds. Do not use vague terms like 'fast' or 'subtle'.
4. Easing: the named curve or cubic-bezier values (e.g. 'ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)'). Note if the design tool curve must be converted.
5. Intent: one sentence on why the motion exists — it guides engineers when they must adapt the spec to constraints.

## Standard Duration Reference

Calibrate against these ranges; deviate only with intent:
- Micro-interactions (button press, toggle, checkbox): 100-200ms.
- Element enter/exit (dropdown, tooltip, popover): 200-300ms.
- Panel or sheet transitions (side drawer, modal): 300-400ms.
- Page-level transitions or complex orchestrations: 400-600ms.
- Never exceed 600ms for UI feedback; reserve longer durations for deliberate narrative motion.

## Easing Conventions

- Elements entering the screen: ease-out (starts fast, decelerates into place).
- Elements leaving the screen: ease-in (starts slow, accelerates off).
- Elements repositioning within the screen: ease-in-out.
- Spring or bounce effects: provide the stiffness and damping values, not just 'spring'.
- If using a design system token (e.g. 'motion-ease-standard'), include the resolved cubic-bezier so engineers without design-tool access can verify.

## Orchestration and Sequencing

When multiple elements animate together:
- List each element in order with its offset delay (e.g. 'icon fades in at 0ms, label fades in at 60ms').
- State whether elements overlap in time or wait for the previous to complete.
- Describe the 'feel' goal in one phrase (e.g. 'staggered reveal, content appears to cascade down') so engineers catch drift during review.

## Reduced Motion

Every motion spec must include a reduced-motion variant:
- State which animations are removed entirely vs. replaced with an instant state change vs. reduced in duration.
- Default: respect 'prefers-reduced-motion: reduce' by removing decorative motion and collapsing durations to 0ms for essential transitions.
- Mark any animation that conveys information (not just decoration) — these must have a non-motion fallback.
