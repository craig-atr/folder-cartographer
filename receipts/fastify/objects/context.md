---
noun: context
state: live
catalog: the per-route snapshot the hot request path reads
source: lib/context.js:23, lib/route.js:341
hits: route
misses: fastify-factory
---

## What it is
`Context` (`lib/context.js:23`) is a per-route bag of everything the request hot-path needs pre-resolved from
the enclosing instance: the `Reply` / `Request` constructors, the content-type parser, the hook arrays, the
error handler, schemas and serializers, and the body limit. One is built per registered route
(`lib/route.js:341`), and find-my-way hands that exact object back to the route handler on every matching
request.

## Why it is shaped this way
Resolving the encapsulated instance's state *once at registration* into a flat object means the per-request
path does zero prototype-chain walking or option merging — it reads fixed fields. That snapshot is where a
large part of Fastify's throughput comes from.

## Hits — change this, these move
- `route` — the `Context` is constructed by `route` registration and shaped to what find-my-way will replay; change the `Context` fields and the registration code that fills them must change with it.

## Does not hit — the wrong neighbour
- `fastify-factory` — a reader assumes the `Context` is a live view of the instance, so decorating or adding
  hooks to the instance *after* a route is registered updates that route. It does not: the `Context` copied
  the instance's constructors and hook arrays by reference at build time. It is a registration-time snapshot,
  not a live window onto the factory's instance.
