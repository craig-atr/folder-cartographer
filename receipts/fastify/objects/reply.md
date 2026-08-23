---
noun: reply
state: live
catalog: wraps the raw response; owns serialization and the send path
source: lib/reply.js:65, fastify.js:168
hits: context
misses: fastify-factory
---

## What it is
`Reply` (`lib/reply.js:65`) wraps the raw `http.ServerResponse` and owns status, headers, serialization, and
the `send` / `onSend` / `onResponse` egress path. The factory builds a *per-instance subclass* of it
(`Reply.buildReply(Reply)`, `fastify.js:168`) so `decorateReply` can add methods to this instance's `Reply`
without leaking across encapsulation boundaries.

## Why it is shaped this way
A fresh subclass per instance (not one shared prototype) means plugin-scoped reply decorators stay contained
to their subtree. The constructor caches the request and log references so the send hot-path avoids
re-looking them up on every reply.

## Hits — change this, these move
- `context` — each route's `Context` snapshots this instance's `Reply` constructor (`this.Reply = server[kReply]`); change the `Reply` subclass and what every route constructs on reply moves.

## Does not hit — the wrong neighbour
- `fastify-factory` — a reader assumes `fastify.decorate` adds reply methods, since it is "the" decorator.
  It does not: `decorate` writes to the *instance* object, while `decorateReply` targets the `Reply`
  subclass. Adding a reply method through the instance decorator lands on the wrong object and never appears
  on `reply`.
