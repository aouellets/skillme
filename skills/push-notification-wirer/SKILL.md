---
name: Push Notification Wirer
description: Wires native mobile push end to end on APNs and FCM — device-token registration, alert and silent payloads, permission priming, server send path, and tap routing into the app. Use when you are adding push to an iOS or Android app, debugging why a push never arrives or never wakes the app, wiring the .p8/service-account server sender, or handling a notification tap. Do NOT use for web/browser push (Web Push/VAPID), in-app banners, or platform notification dashboards — and for navigating a tapped payload into a specific screen, use a deep-link router instead.
---
# Push Notification Wirer

Wire native iOS (APNs) and Android (FCM) push as a verified pipeline: every hop fails silently — a wrong key, stale token, backgrounded app, or missing entitlement all produce "nothing happened" with no error — so prove each hop instead of assuming it.

## Workflow

1. **Register and persist the token.** Register for remote notifications, capture the device token (APNs) or registration token (FCM), and POST it to your server keyed by user AND device. Send it on every launch and on the rotation callback (`didRegisterForRemoteNotifications` / FCM `onNewToken`) — never only once at signup. Tokens change on reinstall, restore, and refresh.
2. **Expire dead tokens.** Delete the token on logout and whenever a send returns APNs 410 / FCM `UNREGISTERED`. Stop pushing to dead devices or your delivery stats lie.
3. **Prime the permission, then prompt.** Show your own explainer tied to a value moment, then trigger the OS prompt. On iOS you get one prompt — a denial routes the user to Settings. On Android 13+ request the `POST_NOTIFICATIONS` runtime permission explicitly. Handle the denied state without breaking the feature.
4. **Build the payload for the intended behavior.** Alert push: `aps.alert` (iOS) or `notification` (FCM), shown by the OS. Silent/background push: `content-available:1` plus the `remote-notification` background mode and low priority (iOS), or data-only (FCM) — these are throttled and not guaranteed. Put routing info in custom data keys, never in visible text. Stay under the size limit (4KB APNs).
5. **Send over the modern server path.** APNs token-based auth (.p8 key + key id + team id) over HTTP/2 — not legacy certs. FCM v1 API with a service account. Set `apns-priority` / FCM priority: high for user-visible, low for silent.
6. **Log the send result.** Record the APNs/FCM response id and HTTP status on every send so a non-delivery is debuggable rather than mysterious.
7. **Handle taps in all three app states.** A tap arrives in foreground, background, or terminated. Terminated launches deliver the payload through launch options / `getInitialMessage`, not the normal listener — wire that path explicitly. Parse a routing key into a typed in-app destination; hand the actual navigation to a deep-link router.

## Quality bar

- Token is persisted per user+device and re-sent on launch and on every rotation callback.
- 410 / `UNREGISTERED` responses delete the stored token.
- Permission is primed before the OS prompt; denial degrades gracefully.
- Alert vs silent payload shape is chosen deliberately and stays under 4KB.
- Server uses .p8 token auth over HTTP/2 (APNs) and FCM v1 with a service account; every send logs a response id + status.
- Tap routing is verified from a cold terminated state, not just foreground.

## Do NOT

- Do NOT register the token once at signup and never again — rotation will silently strip delivery.
- Do NOT request notification permission on first launch with no context.
- Do NOT put routing data in the visible alert text, or exceed the payload size limit.
- Do NOT rely on silent push for guaranteed or timely delivery — it is throttled.
- Do NOT use legacy APNs certificates or the legacy FCM HTTP API.
- Do NOT treat the payload as a raw URL to open blindly; map a routing key to a typed destination.
- Do NOT hand-roll a segmented fan-out sender at scale — reach for a provider (FCM topics, OneSignal, a provider SDK), but keep owning token hygiene and permission UX.
