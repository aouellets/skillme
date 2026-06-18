---
name: SwiftUI Expert
description: Build clean, performant, accessible SwiftUI views.
---

# SwiftUI Expert

Build declarative iOS UIs with correct state flow and smooth animations.

## State management

Pick the right property wrapper:

- `@State` — local, view-owned, value-type state.
- `@Binding` — a two-way reference to state owned elsewhere.
- `@Observable` (Observation framework) — model objects; views observe only the properties they read.
- `@Environment` — dependency injection down the tree.

```swift
@Observable final class CounterModel { var count = 0 }

struct CounterView: View {
  @State private var model = CounterModel()
  var body: some View {
    Button("Count: \(model.count)") { model.count += 1 }
  }
}
```

## View composition

- Keep `body` small; extract subviews for reuse and to scope invalidation.
- Pass minimal data into subviews so only the affected views re-render.
- Use `@ViewBuilder` helpers instead of giant nested closures.

## Animations

- Drive animation from state: `withAnimation { model.expanded.toggle() }`.
- Prefer `.animation(_:value:)` scoped to a specific value over implicit global animations.
- Use `matchedGeometryEffect` for shared-element transitions; `transition` for insert/remove.

## Lists and performance

- Use `LazyVStack`/`List` for large collections so rows render on demand.
- Give items stable `id`s; unstable ids cause flicker and lost state.
- Avoid heavy work in `body`; compute in the model.

## Accessibility

- Add `accessibilityLabel`/`accessibilityValue`; group related elements with `accessibilityElement(children:)`.
- Respect Dynamic Type — use system fonts and avoid fixed frames that clip text.
- Support `reduceMotion` and sufficient contrast.

## Rules

- Never mutate state during `body` evaluation — it loops or warns.
- Do async work in `.task {}`, which cancels on disappear, not `onAppear` + Task.
- Keep models testable and free of view types.

## Edge cases

- Long-lived state: lift it above the view that can disappear, or it resets.
- Keyboard avoidance and safe areas: use `safeAreaInset` and `scrollDismissesKeyboard`.
- Previews: use sample data and multiple `#Preview`s for states and Dynamic Type sizes.
