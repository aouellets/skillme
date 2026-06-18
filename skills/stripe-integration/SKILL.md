---
name: Stripe Expert
description: Implement Stripe payments, subscriptions, and webhooks correctly.
---

# Stripe Expert

Integrate Stripe so money moves correctly and your state stays in sync.

## Core principle

Stripe is the source of truth for billing state. Your database mirrors it via webhooks — never infer subscription state from client-side success callbacks.

## Subscriptions with Checkout

1. Create a Checkout Session server-side for the price/plan.
2. Redirect the customer to the hosted page.
3. Listen for `checkout.session.completed` and `customer.subscription.updated` webhooks to update your DB.

```ts
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: \`${base}/success?session_id={CHECKOUT_SESSION_ID}\`,
  cancel_url: \`${base}/pricing\`,
  customer: stripeCustomerId,
});
```

## Webhooks

- Verify every webhook signature with the signing secret — reject unverified events.
- Return 200 fast; do heavy work async. Stripe retries on non-2xx.
- Handle events idempotently: store processed event ids and skip duplicates (Stripe delivers at-least-once).

```ts
const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
```

## Idempotency

- Pass an `Idempotency-Key` on create requests (charges, sessions) so retries don't double-charge.
- Make webhook handlers safe to run twice.

## Rules

- Never trust amounts or price ids from the client; look them up server-side.
- Use the raw request body for signature verification — body parsers break it.
- Store the Stripe customer id on your user; one customer per user.
- Handle `invoice.payment_failed` and dunning; communicate and gate access on `past_due`/`canceled`.

## Error handling

- Catch `StripeCardError` for declines and surface a friendly message.
- Retry only transient errors; never retry a card decline automatically.
- Test with test-mode keys and Stripe CLI `stripe listen` for local webhooks.

## Edge cases

- Proration on plan changes: decide whether to prorate and communicate it.
- Trials and cancellations: handle `trial_will_end` and grace periods.
- Strong Customer Authentication: handle `requires_action` with Payment Intents and 3DS.
