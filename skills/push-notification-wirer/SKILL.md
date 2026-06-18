---
name: Push Notification Wirer
description: Wires APNs and FCM push end to end including tokens, payloads, deep links, permission UX, and silent pushes. Use when adding push notifications, debugging delivery, or handling notification taps.
---
# Push Notification Wirer
Push has many moving parts that fail silently: a wrong key, a stale token, a backgrounded app, or a missing entitlement all produce "nothing happened" with no error. Wire it as a pipeline and verify each hop, because the failure modes are invisible by default.

## Tokens Are Per-Device and Rotate
Register for push, receive the device token (APNs) or FCM registration token, and POST it to your server keyed by user and device. Tokens change — on reinstall, restore, or FCM refresh — so update on every launch and on the onNewToken/didRegisterForRemoteNotifications callback, never just once at signup. Delete tokens on logout and on 410/Unregistered responses so you stop pushing to dead devices.

## Ask for Permission at the Right Moment
Never request notification permission on first launch with no context. Prime it: show your own explainer screen tied to a value moment, then trigger the OS prompt. On iOS you get one shot — a denial sends users to Settings. On Android 13+ POST_NOTIFICATIONS is a runtime permission you must request explicitly. Always handle the denied state gracefully.

## Payload Shape Determines Behavior
An alert push carries aps.alert (iOS) or notification (FCM) and is shown by the OS. A silent/background push sets content-available:1 (iOS, plus the remote-notification background mode and low priority) or is data-only (FCM) to wake the app for a quiet fetch — these are throttled and not guaranteed. Put routing info in custom data keys, not in the visible text. Keep payloads under the size limit (4KB APNs).

## Deep Links Must Survive Cold Start
A notification tap can arrive in three states: foreground, background, and terminated. Handle all three — terminated launches deliver the payload through the launch options / getInitialMessage path, not the normal listener. Parse a routing key into a typed in-app destination and navigate; never trust the payload to be a raw URL you open blindly.

## Server Send Path
Use APNs token-based auth (.p8 key, key id, team id) over HTTP/2 rather than legacy certs, and the FCM v1 API with a service account. Set apns-priority and FCM priority correctly: high for user-visible, low for silent. Log the APNs/FCM response id and status so a non-delivery is debuggable instead of mysterious.

## When to Reach for a Provider
If you need segmentation, scheduling, and analytics, a service (FCM topics, OneSignal, a provider SDK) saves real work — but you still own token hygiene and permission UX. Do not hand-roll a fan-out sender at scale.
