---
name: Jetpack Compose Builder
description: Builds Android Jetpack Compose UI with hoisted state, unidirectional data flow, and recomposition-safe patterns. Use when writing or refactoring @Composable functions, Compose screens in Kotlin/.kt files, ViewModel/StateFlow wiring, LazyColumn lists, or fixing Compose recomposition jank. Do NOT use when the screen targets Flutter or a generic cross-platform mobile UI — use flutter-widget-architect instead.
---
# Jetpack Compose Builder

Build the state and data flow first, the pixels second — most Compose bugs are state-ownership and recomposition bugs, not layout bugs.

## Workflow
1. **Map state ownership before drawing anything.** Decide which state is UI-local (remember) versus screen-level (ViewModel exposing StateFlow, collected via collectAsStateWithLifecycle()). Hold mutable state in the lowest common ancestor that needs it.
2. **Make composables stateless by default.** Pass immutable state down as parameters; emit changes up via lambdas (onValueChange, onClick). A composable that owns its own remember { mutableStateOf } cannot be controlled, previewed, or tested by its parent — hoist it.
3. **Remember with correct keys.** Use remember to cache across recompositions and rememberSaveable to survive config change and process death. Key remember/LaunchedEffect/derivedStateOf on the inputs they depend on; LaunchedEffect(Unit) where an id should restart the effect is a bug. Wrap expensive derived values in derivedStateOf so they recompute only when the result changes.
4. **Confine side effects to effect handlers.** LaunchedEffect for scoped suspend work, rememberCoroutineScope for event-driven launches, DisposableEffect for cleanup, SideEffect to publish Compose state to non-Compose code. Never launch coroutines or write state in the composable body — state writes during composition throw or loop.
5. **Build lists with LazyColumn/LazyRow and stable item keys** so reorders animate and item state survives. Hoist scroll position with rememberLazyListState when you must observe or control it. Prefer slot APIs (content lambdas) over boolean flags.
6. **Contain recomposition.** Push State reads down to the smallest composable that needs them. Use lambda-based modifiers (Modifier.offset { } over Modifier.offset()) to defer reads to layout/draw. Pass stable types so skipping works.
7. **Measure before optimizing.** Capture recomposition counts in the Layout Inspector; fix the composable that actually recomposes too often. Annotate stability only against measured evidence.

## Quality bar
- Every leaf composable is stateless, parameterized, and renders in a @Preview without a ViewModel.
- State flows down as immutable values; events flow up as lambdas. No two-way ownership.
- Effects are keyed on their real inputs; no LaunchedEffect(Unit) that should restart.
- Lists carry stable keys; no scrolling list nested in a verticalScroll Column.
- Any optimization is backed by a Layout Inspector recomposition count, not a guess.

## Do NOT
- Do NOT keep mutable UI state inside a child composable the parent must drive — hoist it.
- Do NOT launch coroutines or mutate state directly in the composable body.
- Do NOT key LaunchedEffect/remember on Unit when it should re-run on an id or input change.
- Do NOT nest a LazyColumn/LazyRow inside a verticalScroll/horizontalScroll of the same axis.
- Do NOT pass unstable params (non-@Immutable data classes, lambdas recreated each pass) into hot composables — they defeat skipping.
- Do NOT scatter stability annotations or premature optimizations before measuring.
- Do NOT rewrite working XML/View screens to chase purity; AndroidView is fine for heavy interop or established View code.
