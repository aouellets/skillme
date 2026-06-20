---
name: Mobile Perf Profiler
description: Diagnoses and fixes mobile jank, dropped frames, and growing memory by capturing a trace or heap snapshot, isolating the worst frame or leak, fixing it, and re-measuring against the frame budget. Use when a mobile app stutters or drops frames, scrolling a long list is slow, memory grows over repeated navigation, or the UI feels laggy on a real device. Do NOT use when the bottleneck is a server-side or web hot path (slow endpoint, query, render time) — use optimize-performance instead.
---
# Mobile Perf Profiler
Diagnose mobile performance from measured evidence, fix the largest cost, and re-measure. Never guess.

## Workflow
1. Reproduce on a representative device. Run a release/profile build on a real mid-tier device, not a debug build or simulator — debug builds and simulators misreport timing. Name the exact symptom: jank while scrolling, jank on first frame, or memory that climbs.
2. Capture evidence before touching code. For frame/CPU jank, record a trace; for memory, take a heap snapshot. Use the platform tool:
   - iOS: Instruments — Time Profiler (CPU), Allocations and Leaks (memory), Animation Hitches (rendering).
   - Android: Perfetto / system tracer and Macrobenchmark for frames; Studio CPU and Memory profilers; LeakCanary for leaks.
   - Flutter: DevTools timeline and performance overlay; read the UI-thread vs raster-thread split.
3. Locate the worst offender from the trace. Find the frames that miss the budget and the single most expensive thing they do. For Flutter, read which thread is blown first: raster-thread jank is overdraw or shader compilation; UI-thread jank is Dart build/layout. Do not change code until the trace points at one cause.
4. Apply the fix that matches the measured cause:
   - Over-rendering: stop rebuilding/recomposing subtrees that did not change; move allocation, parsing, and I/O off the build/onDraw path; cache derived values; flatten the view hierarchy; reduce overdraw from stacked opaque layers.
   - Long lists: virtualize with cell reuse (RecyclerView, LazyColumn, UICollectionView, ListView.builder) so only visible rows exist; give stable keys/ids and fixed or estimated item sizes; paginate the data source.
   - First-frame jank: warm or simplify shader compilation and cold layout inflation.
   - Leaks: diff the before/after heap snapshots for objects that are retained but should be gone — undisposed controllers/streams/subscriptions, listeners never removed, static or singleton references to a destroyed Activity/ViewController, unbounded image caches. Decode images at display size, not source size.
5. Re-measure on the same device and build. Confirm the symptom is gone against the budget, not against a microbenchmark.

## Quality bar
- 60Hz allows ~16.6ms per frame; 120Hz allows ~8.3ms. Success is every frame holding the budget on a representative device — jank is a single missed deadline the user sees, not an average.
- Memory is flat under repeated navigation (push a screen, pop it, repeat) with no monotonic growth.
- Every change is justified by the trace or snapshot it came from, and verified by a re-measurement.

## Do NOT
- Do NOT prescribe a fix without a captured trace or heap snapshot — no folklore optimizations.
- Do NOT profile a debug build or a simulator/emulator, or a flagship device, and treat the numbers as real.
- Do NOT micro-optimize a path the profiler shows is cheap; readability beats a nanosecond no user perceives.
- Do NOT chase averages or synthetic benchmarks instead of the frames that actually miss the budget.
- Do NOT load the full dataset to render a screenful of rows.
