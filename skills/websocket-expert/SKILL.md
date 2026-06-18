---
name: WebSocket Expert
description: Build resilient real-time WebSocket systems.
---

# WebSocket Expert

Ship real-time connections that survive flaky networks and scale.

## Connection lifecycle

1. Connect with an auth token in the subprotocol or first message — not in the URL (URLs are logged).
2. On open, flush any queued outbound messages.
3. On close/error, reconnect with exponential backoff and jitter.
4. Use heartbeats to detect dead connections that never fire `close`.

## Reconnection with backoff

```js
let attempt = 0;
function connect() {
  const ws = new WebSocket(url);
  ws.onopen = () => { attempt = 0; flushQueue(ws); };
  ws.onclose = () => {
    const delay = Math.min(30000, 2 ** attempt * 500) + Math.random() * 500;
    attempt++;
    setTimeout(connect, delay);
  };
}
```

## Heartbeats

- Send a ping every 20-30s; if no pong within a timeout, force-close and reconnect.
- Server-side, terminate connections that miss N pongs to free resources.

## Message queuing and delivery

- Queue outbound messages while disconnected; cap the queue and drop oldest or surface backpressure.
- Add a monotonic sequence number to detect gaps after reconnect.
- For at-least-once delivery, ack messages and resend unacked ones; make handlers idempotent.

## Rules

- Always send `wss://` (TLS). Plain `ws://` over the internet is unacceptable.
- Validate and size-limit every inbound frame; never `eval` or trust payloads.
- Authenticate on connect and re-check authorization per sensitive message.
- Use rooms/channels server-side; never broadcast to all sockets blindly.

## Scaling

- A single node holds connections in memory; to scale horizontally use a pub/sub backplane (Redis, NATS) so any node can reach any subscriber.
- Sticky sessions or a shared session store are needed if you do per-connection state.

## Edge cases

- Mobile background/foreground: expect frequent disconnects; reconnect aggressively but with jitter to avoid thundering herd.
- Proxies that buffer: send periodic data so intermediaries don't time out idle connections.
- Slow consumers: monitor `bufferedAmount`; stop sending or disconnect clients that can't keep up.
