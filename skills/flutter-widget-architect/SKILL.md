---
name: Flutter Widget Architect
description: Architects Flutter widget trees and Riverpod or Bloc state so rebuilds are scoped, build() stays pure, and const widgets skip recomposition. Use when building or refactoring Flutter screens in .dart files, fixing jank or rebuild storms, choosing between Riverpod and Bloc, or wiring StatelessWidget/StatefulWidget, Consumer, or BlocBuilder. Do NOT use for Android Jetpack Compose UI — use jetpack-compose-builder instead; do NOT use for React Native — use react-native-pro instead.
---
# Flutter Widget Architect

Structure Flutter widget trees and state so rebuilds start and stop where you intend and build() is a pure, cheap function of state.

## Workflow

1. **Decompose into widget classes, not methods.** Split a deep build() into small `StatelessWidget`/`StatefulWidget` subclasses. Never extract subtrees into `_buildX()` helper methods — a helper always re-runs with its enclosing build(), while a separate `const` widget is skipped when its inputs are unchanged. Mark `const` everywhere the analyzer allows.
2. **Keep build() pure.** build() must read state and return widgets only — no network calls, timers, setState, or controller allocation. Create `AnimationController`, `TextEditingController`, `StreamSubscription`, etc. in `initState` or a provider, and dispose every one in `dispose`.
3. **Pick one state tool and scope it.** Use Riverpod for dependency-injected, testable state with `autoDispose` for screen-scoped data; use Bloc for explicit event-to-state transitions over an auditable stream. Do not mix both in one feature. For purely local ephemeral UI state (a toggle, a single text field), use `StatefulWidget` + `setState` — do not reach for a global store.
4. **Watch the narrowest unit.** Subscribe to one field with `ref.watch(provider.select(...))` or a Bloc `buildWhen`, never the whole model. Use `ref.read` for one-shot actions inside callbacks, never to react to changes.
5. **Stop rebuilds at the boundary.** Wrap only the changing subtree in `Consumer`/`BlocBuilder`/`ValueListenableBuilder` and leave the static shell (AppBar, background) outside it. Pass `child` through builders to reuse subtrees the rebuild does not touch.
6. **Build lists lazily with stable keys.** Use `ListView.builder`/`SliverList` so off-screen items are not built. Give items a `ValueKey` on the model id so element and state survive reorder.
7. **Bound your layout.** Wrap flexible children in `Expanded`/`Flexible` inside `Column`/`Row` to prevent unbounded-height constraints, overflow, and layout thrash.

## Quality bar

- The static shell does not rebuild when a single value changes (verify with `debugPrintRebuildDirtyWidgets` or DevTools rebuild tracking).
- Every controller, subscription, and `AnimationController` created is disposed; `flutter analyze` reports no dispose or `prefer_const_constructors` warnings.
- Long or unbounded lists use a lazy builder, never a mapped `Column`/`ListView(children: [...])`.
- State scope matches sharing: local state stays in `StatefulWidget`; shared/async/tested state lives in a provider or Bloc.

## Do NOT

- Do NOT extract subtrees into `_buildX()` helper methods that return `Widget`.
- Do NOT do work in build() (I/O, timers, allocation, setState).
- Do NOT `ref.watch` a whole model when you depend on one field; use `.select`/`buildWhen`.
- Do NOT call `setState` on a large `State` to update one value; isolate it with `ValueListenableBuilder` or a scoped provider.
- Do NOT leave a `ListView`/`Column` building every item or with unbounded height.
- Do NOT introduce Riverpod and Bloc into the same feature.
