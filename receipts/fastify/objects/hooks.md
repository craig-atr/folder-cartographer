---
noun: hooks
state: live
catalog: the per-instance lifecycle-hook store and its runners
source: lib/hooks.js:40, fastify.js:156
hits: context, reply
misses: fastify-factory
---

## What it is
`Hooks` (`lib/hooks.js:40`) is a per-instance container of lifecycle-hook arrays — `onRequest`,
`preHandler`, `onSend`, `onResponse`, and the rest — constructed once per instance (`fastify.js:156`). The
same module exports the *runners* that walk those arrays in order during a request, in both callback and
promise styles. `addHook` appends to the instance's store and propagates to already-created children.

## Why it is shaped this way
Hooks are validated up front and pre-compiled into each route's `Context`, so the hot request path iterates
flat arrays by index instead of doing a dynamic lookup. Each instance owns its own `Hooks` so encapsulation
holds — a plugin's hooks stay in its subtree.

## Hits — change this, these move
- `context` — a route's hook arrays are copied into its `Context` at registration; change the hook shape and every route's snapshot changes.
- `reply` — the `onSend` / `onResponse` runners fire from the reply/send path; change them and the egress lifecycle moves.

## Does not hit — the wrong neighbour
- `fastify-factory` — a reader assumes there is one hook engine, so application startup hooks and per-request
  hooks are the same machinery. They are not: `onReady` / `preClose` run through a separate
  application-hook runner driven by avvio's boot, not the per-request runners. Editing the request lifecycle
  does not touch the app-boot track the factory sets up.
