---
name: React Native Pro
description: Build and ship production React Native apps.
---

# React Native Pro

Ship reliable cross-platform mobile apps with good performance and DX.

## Project setup

- Prefer Expo with the managed/prebuild workflow and EAS for builds and OTA updates.
- Use the New Architecture (Fabric + TurboModules) for new apps.
- TypeScript everywhere; strict mode on.

## Navigation

- Use React Navigation (native stack) or Expo Router (file-based).
- Type your routes and params so navigation is checked at compile time.
- Lazy-load heavy screens; keep the initial route light for fast cold start.

```tsx
<Stack.Screen name="Profile" component={ProfileScreen} />
// navigate('Profile', { userId })
```

## Performance

- Use `FlatList`/`FlashList` for long lists; never `map` thousands of items in a ScrollView.
- Provide `keyExtractor`, `getItemLayout` when possible, and memoized row components.
- Memoize with `React.memo`, `useCallback`, `useMemo` to cut re-renders.
- Run animations on the UI thread with Reanimated worklets; avoid JS-driven `Animated` for gestures.
- Optimize images: correct resolution, caching, and `expo-image`.

## Native modules

- Reach for a native module only when JS can't do it. Check the ecosystem first.
- With the New Architecture, write TurboModules with a codegen spec for type-safe bridging.
- Keep the bridge chatty-free: batch calls and pass primitives, not large objects per frame.

## EAS builds and releases

- Configure `eas.json` profiles: development, preview, production.
- Use OTA updates for JS-only changes; submit a store build for native changes.
- Manage secrets via EAS secrets, not committed env files.

## Rules

- Handle platform differences with `Platform.select`, not copy-paste branches.
- Test on real low-end Android devices — the JS thread is the bottleneck.
- Catch errors with an error boundary and report to a crash service (Sentry).

## Edge cases

- Deep links and universal links: configure and test both platforms.
- Background tasks and notifications: respect OS limits; use Expo Notifications.
- App size: enable Hermes, remove unused locales/assets, and audit dependencies.
