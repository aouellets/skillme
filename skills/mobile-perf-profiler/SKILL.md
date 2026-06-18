---
name: Mobile Perf Profiler
description: Diagnoses jank, over-rendering, and memory issues on mobile using frame budget, leak detection, and list virtualization. Use when an app stutters, drops frames, grows memory, or feels slow to scroll.
---
# Mobile Perf Profiler
Performance work without measurement is guessing. Capture a trace, find the slow frames, fix the biggest one, re-measure. The goal is a stable frame cadence, not a faster microbenchmark nobody feels.

## Know Your Frame Budget
At 60Hz you have ~16.6ms per frame to do layout, draw, and commit; at 120Hz only ~8.3ms. Jank is any frame that misses the deadline — the user sees a stutter, not an average. Profile in release/profile mode on a real mid-tier device, never a debug build on a flagship: debug builds and simulators lie about timing.

## Use the Right Trace Tool
iOS: Instruments (Time Profiler for CPU, Allocations and Leaks for memory, Core Animation/Hitches for rendering). Android: the system tracer / Perfetto and Macrobenchmark, plus Studio's CPU and Memory profilers. Flutter: DevTools timeline and the raster vs UI thread split — jank on the raster thread is a shader/overdraw problem, jank on the UI thread is your Dart build/layout. Read which thread is blown before changing code.

## Kill Over-Rendering
Most jank is doing work that produces no visible change: rebuilding/recomposing subtrees that did not change, overdraw from stacked opaque layers, expensive work inside build/onDraw. Move allocation and parsing off the build path, cache derived values, and flatten view hierarchies. On first frame, shader compilation jank (Flutter) and cold layout inflation are common — warm or simplify them.

## Virtualize Long Lists
A list that builds every row is the classic memory and scroll killer. Use RecyclerView, LazyColumn, UICollectionView with cell reuse, or ListView.builder so only visible items exist. Add stable keys/ids for correct recycling, fixed or estimated item sizes to avoid relayout, and paginate the data source — never load 10k rows to show 12.

## Find Leaks by Retention
Memory that only grows is a leak. Take a heap snapshot, navigate, return, snapshot again, and diff retained objects. Usual culprits: undisposed controllers/streams/subscriptions, listeners never removed, static or singleton references to a destroyed Activity/ViewController, and image caches without bounds. On Android, LeakCanary surfaces these automatically; decode images at display size, not source size.

## When to Stop
Stop when frames hold the budget on a representative device and memory is flat under repeated navigation. Do not micro-optimize a path the profiler shows is cheap — readability beats a nanosecond nobody perceives.
