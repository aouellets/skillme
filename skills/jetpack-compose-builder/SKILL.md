---
name: Jetpack Compose Builder
description: Builds Android Jetpack Compose UI with correct state hoisting, unidirectional data flow, and recomposition-safe patterns. Use when writing or refactoring Compose screens, composables, or state handling.
---
# Jetpack Compose Builder
Compose is a snapshot system that re-executes composables when the State they read changes. Most bugs are not layout bugs — they are state-ownership and recomposition bugs. Build the data flow first, the pixels second.

## Hoist State, Pass Events Down-Up
Make composables stateless by default. A composable receives immutable state as parameters and emits events via lambdas (onValueChange, onClick). Hold mutable state in the lowest common ancestor that needs it, or in a ViewModel exposing StateFlow collected with collectAsStateWithLifecycle(). A stateless composable is previewable, testable, and reusable; a composable that owns its own remember { mutableStateOf } cannot be controlled by its parent.

## Remember Correctly Or Leak Work
Use remember to cache across recompositions and rememberSaveable to survive config changes and process death. Key your remember/LaunchedEffect/derivedStateOf on the inputs they depend on — a LaunchedEffect(Unit) that should restart when an id changes is a real bug. Wrap expensive derived computations in derivedStateOf so they recompute only when the result actually changes, not on every recomposition.

## Defend Against Recomposition Storms
Reading a frequently-changing State high in the tree recomposes the whole subtree. Push reads down to the smallest composable, and use lambda-based modifiers (Modifier.offset { } over Modifier.offset()) to defer reads to layout/draw. Pass stable types — unstable params (non-@Immutable classes, lambdas recreated each pass) defeat skipping. Profile with the Layout Inspector recomposition counts before guessing.

## Lists, Keys, and Slot APIs
Use LazyColumn/LazyRow with stable item keys so reorders animate and state survives. Never put a scrolling list inside a verticalScroll Column. Prefer slot APIs (content lambdas) over boolean flags for flexible components. Hoist scroll state with rememberLazyListState when you need to observe or control position.

## Side Effects Belong in Effect Handlers
Never launch coroutines or mutate state directly in the composable body. Use LaunchedEffect for scoped suspend work, rememberCoroutineScope for event-driven launches, DisposableEffect for cleanup, and SideEffect to publish Compose state to non-Compose code. State writes during composition throw or loop.

## When to Stop
For heavy interop or established View screens, AndroidView is fine — do not rewrite working XML to chase purity. If recomposition is correct but slow, measure before optimizing; premature stability annotations add noise.
