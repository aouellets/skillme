---
name: Strangler Fig Planner
description: Produces an incremental migration plan that runs the legacy and new systems side by side behind a routing layer, slicing and sequencing work to avoid a big-bang rewrite. Use when planning to replace or rebuild a legacy system that must stay live throughout.
---
# Strangler Fig Planner
A rewrite that goes dark for six months is how teams die. The strangler fig pattern keeps the old system serving traffic while you grow the new one around it, route by route, until the old trunk can be cut.

## Install the Routing Seam First
Nothing else works without a place to redirect traffic per slice. Find or insert the seam: a reverse proxy (NGINX, Envoy), an API gateway, a facade service, or a feature-flag check inside the legacy entry point. The seam must route at the granularity you intend to migrate — per endpoint, per URL prefix, per message type. Verify you can flip one route to the new system and back without a deploy. If you cannot route incrementally, you cannot strangle incrementally; build the seam as step zero.

## Slice by Business Capability, Not Layer
Slice vertically: a whole capability (checkout, user profile, billing export) end to end, not 'the data layer' or 'all the controllers'. Pick the first slice for low risk and high learning: modest traffic, few upstream dependencies, clear ownership, observable behavior. Avoid starting with the crown-jewel transaction. Each slice should be shippable in days to a few weeks, not quarters.

## Sequence by Dependency and Data Gravity
Map which slices read/write shared data. Migrate leaf capabilities before the tables everyone touches. Where the new and old share a database, decide per slice: dual-write with reconciliation, change-data-capture, or new-system-owns-the-table with a read replica for legacy. Sequence so each step leaves the system fully working — never a state that only resolves after three more PRs.

## De-risk Every Cutover
For each slice: shadow traffic (send to both, compare, serve old) to validate, then canary a small percent, then ramp. Keep the kill switch until the slice has run at 100 percent through a full business cycle (month-end, peak). Define rollback as flipping the route, not reverting code. Add metrics that compare old vs new outputs in production.

## Define Done and Delete the Trunk
A slice is done when the legacy path has served zero traffic for a defined soak period and the dead legacy code is deleted, not left dormant. Track remaining legacy surface explicitly so the project ends rather than stalling at 80 percent forever.

## When Strangler Fig Is the Wrong Tool
If the system is small enough to rewrite in under a few weeks, or has no stable seam and no way to add one, a careful in-place rewrite may be cheaper. Strangler fig is for large, live, business-critical systems where downtime and regression risk dominate. Don't impose the ceremony on a script.
