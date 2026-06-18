---
name: Animation System
description: Design a coherent motion system of durations, easing, and choreography for UI.
---

# Animation System

Use this skill to build a motion system that feels intentional and consistent
instead of ad-hoc transitions scattered across components.

## Motion has a job

Animation should do work: direct attention, show cause and effect, express
hierarchy, or soften a change. If a motion does none of these, cut it.

## Step 1: Define duration tokens

Establish a small scale. Faster for small/near elements, slower for large/far ones.

- `instant`: 0ms (state with no transition)
- `fast`: 100ms (hovers, small toggles)
- `base`: 200ms (most transitions)
- `slow`: 300ms (modals, sheets, page-level)
- `deliberate`: 500ms (large or first-run reveals)

Never exceed ~500ms for interactive feedback — it starts to feel sluggish.

## Step 2: Define easing curves

- `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`) — for elements **entering**. Fast start, gentle stop.
- `ease-in` (`cubic-bezier(0.4, 0, 1, 1)`) — for elements **exiting**. They accelerate away.
- `ease-in-out` (`cubic-bezier(0.4, 0, 0.2, 1)`) — for elements **moving** on screen.
- `spring` — for playful, physical interactions (drag release, bouncy toggles).

Rule of thumb: things that appear should decelerate in; things that leave accelerate out.

## Step 3: Choreography

When multiple elements animate, sequence them:

- **Stagger** list items by 20–40ms so they cascade, not flash.
- **Anchor** transitions to the trigger — a menu grows from the button that opened it.
- Animate the **most important** element first; supporting elements follow.
- Avoid animating more than ~5 things at once; group the rest.

## Step 4: Properties to animate

Prefer GPU-friendly properties: `transform` and `opacity`. Avoid animating
`width`, `height`, `top`, or `left` — they trigger layout and stutter.

## Step 5: Accessibility

Always honor reduced-motion. Provide a non-animated fallback:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

Replace large motions with simple cross-fades rather than removing feedback entirely.

## Step 6: Document as tokens

Express the system as named tokens so engineers reuse them:

```js
const motion = {
  duration: { fast: '100ms', base: '200ms', slow: '300ms' },
  easing: { enter: 'cubic-bezier(0,0,0.2,1)', exit: 'cubic-bezier(0.4,0,1,1)' },
};
```

## Output

Deliver the duration scale, easing set, choreography rules, and a per-component
mapping (what animates, which duration, which curve) the team can implement directly.
