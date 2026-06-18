---
name: GraphQL Schema
description: Design GraphQL schemas and resolvers that scale.
---

# GraphQL Schema

Design a schema clients love and a server that doesn't fall over.

## Schema design

1. Model the graph around domain nouns, not your database tables.
2. Use the schema-first SDL as the contract; generate types from it.
3. Prefer non-null (`!`) by default; make a field nullable only when null is a real, meaningful value.
4. Return rich object types, not scalars, so the schema can evolve.

```graphql
type Query {
  order(id: ID!): Order
}
type Order {
  id: ID!
  status: OrderStatus!
  items: [LineItem!]!
  customer: Customer!
}
enum OrderStatus { PENDING PAID SHIPPED }
```

## Pagination

- Use cursor-based connections (Relay spec) for large lists, not offset.
- Expose `edges { node cursor }` and `pageInfo { hasNextPage endCursor }`.

## Solving N+1

The classic trap: resolving `items.customer` fires one query per row. Fix it with DataLoader batching.

```js
const customerLoader = new DataLoader(async (ids) => {
  const rows = await db.customers.whereIn('id', ids);
  return ids.map(id => rows.find(r => r.id === id));
});
// resolver:
Order.customer = (order) => customerLoader.load(order.customerId);
```

## Rules

- Mutations return a payload type with the mutated entity and a `userErrors` list — don't only throw.
- Version by evolving the schema additively; deprecate fields with `@deprecated(reason: ...)` instead of removing.
- Enforce a query depth and complexity limit to prevent abusive nested queries.
- Never expose raw database errors; map them to typed, safe messages.

## Federation

- Split the graph by subgraph ownership; use `@key` to define entity references.
- Each subgraph owns its fields; the gateway composes them.
- Keep entities resolvable by their key in every subgraph that extends them.

## Edge cases

- Authorization: enforce per-field, not just per-resolver entry point.
- Caching: GraphQL POST defeats HTTP caching — use persisted queries or response caching keyed on the query+variables.
- Errors mid-list: use partial results with `errors` array rather than failing the whole response.
