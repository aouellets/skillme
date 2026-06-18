---
name: Prototype Spec
description: Write an implementation-ready prototype spec covering interactions, states, and edges.
---

# Prototype Spec

Use this skill to turn a static design into a precise, build-ready specification of
behavior — so engineering doesn't guess at the parts the mockup can't show.

## What a spec must answer

A static design shows what something looks like at rest. A spec answers:

- What happens when I touch it?
- What does it look like in every state?
- What happens when something goes wrong?

## Step 1: Inventory the interactive elements

List every control: buttons, inputs, toggles, draggables, scroll regions, gestures.
For each, you will specify its states and interactions below.

## Step 2: Specify states

For each interactive element, define every visual state:

- Default, hover, focus, active/pressed, disabled.
- Loading, success, error (where applicable).
- Selected / unselected, expanded / collapsed.

Describe what changes between states (color, elevation, label, icon) referencing
tokens, not raw values.

## Step 3: Specify interactions

For each interaction, write a trigger → response statement:

- **Trigger** — the input (tap, hover 300ms, drag, key press, scroll past threshold).
- **Response** — what changes and how (state change, navigation, data mutation).
- **Transition** — duration, easing, and what animates (reference the motion system).
- **Feedback** — immediate acknowledgment (ripple, spinner, optimistic update).

## Step 4: Transitions between screens

For navigations and overlays, specify:

- Enter and exit animation (direction, duration, easing).
- Whether the previous screen persists, dims, or unmounts.
- Shared-element transitions if any element morphs across screens.

## Step 5: Edge and error behavior

Document the unhappy paths the prototype must handle:

- Empty data, loading, and error states for every data-driven view.
- What happens on slow network (skeletons, progressive reveal, timeout).
- Validation timing — on blur, on submit, or live?
- Concurrency: double-tap, rapid navigation, offline.

## Step 6: Conditional logic

Spell out rules in plain language: "If the cart is empty, the Checkout button is
disabled and shows tooltip X." Cover every branch a designer implied but didn't draw.

## Step 7: Accessibility behavior

- Focus order and focus trapping for modals.
- Keyboard equivalents for every pointer interaction.
- Announcements for dynamic content (live regions).

## Format

Write specs as numbered, testable statements. Each should be verifiable by a QA
engineer without asking a follow-up. Group by screen, then by element.

## Output

Deliver a spec document: element inventory, state matrices, interaction statements
with timing, transition specs, edge-case behaviors, and accessibility notes — ready
to hand directly to engineering.
