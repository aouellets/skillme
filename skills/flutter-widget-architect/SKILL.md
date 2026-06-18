---
name: Flutter Widget Architect
description: Structures Flutter widget trees and state management with Riverpod or Bloc, using const widgets and avoiding rebuild storms. Use when building Flutter screens, refactoring widget trees, or choosing state management.
---
# Flutter Widget Architect
Flutter rebuilds widgets cheaply, but rebuilding the wrong subtree at the wrong frequency is the difference between 60fps and visible jank. Architecture is about controlling where rebuilds start and stop, and keeping build() pure.

## Composition Over Configuration
Favor many small widgets over one giant build() with deep nesting. Extract subtrees into their own StatelessWidget classes — not helper methods returning Widget. A separate const widget can be skipped by the framework when its inputs are unchanged; a _buildHeader() method always re-runs with its enclosing build. Const everything the analyzer allows.

## Keep build() Pure and Cheap
build() must be a pure function of state — no network calls, no timers, no setState, no allocation of controllers. Create AnimationController, TextEditingController, and StreamSubscription in initState or a provider, dispose them in dispose. A leaked controller is the most common Flutter memory bug; the analyzer's dispose lint catches many but not all.

## Pick One State Tool and Scope It
Use Riverpod for dependency-injected, testable state with autoDispose for screen-scoped data; use Bloc when you want explicit event-to-state transitions and an auditable stream. Either way, watch the narrowest provider/selector you can. ref.watch on a whole model rebuilds on any field change — use select to subscribe to one field. Use ref.read for one-shot actions inside callbacks, never to react.

## Stop Rebuild Storms at the Boundary
Wrap the parts that change in Consumer/BlocBuilder and leave the static shell outside it, so a counter update does not rebuild the AppBar and background. Pass child through builders to reuse a subtree the build does not touch. Use ValueListenableBuilder for single-value reactivity instead of setState on a large State.

## Lists, Keys, and Layout
Use ListView.builder / SliverList for long or infinite lists so off-screen items are not built. Give list items stable Keys (ValueKey on the model id) so element reuse and state stay correct on reorder. Avoid unbounded-height constraints inside Column — wrap with Expanded/Flexible to prevent overflow and layout thrash.

## When to Keep It Simple
For truly local, ephemeral UI state (a toggle, a text field), StatefulWidget with setState is correct — do not reach for a global store. Add state management when state is shared, async, or needs testing.
