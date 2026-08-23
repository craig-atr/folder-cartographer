---
noun: plugin-override
state: live
catalog: avvio's child-creation hook - the concrete plugin encapsulation
source: fastify.js:370, lib/plugin-override.js:38
hits: route
misses: hooks
---

## What it is
The function avvio calls every time a plugin is `register`ed. It is installed as `avvio.override`
(`fastify.js:370`) and derives a child instance from the parent with `Object.create(old)`
(`plugin-override.js:38`), so decorators, hooks, and routes added inside a plugin are scoped to that
subtree. This is the concrete mechanism behind Fastify's "encapsulation."

## Why it is shaped this way
Prototype inheritance gives copy-on-write encapsulation for free: a child sees the parent's decorators
through the chain, but writing a new property on the child shadows rather than mutates the parent. Per-subtree
registries are themselves re-created so plugin state forks cleanly at each `register`.

## Hits — change this, these move
- `route` — a route registered inside a plugin runs against the `Object.create`d child this produces, so its `Context` captures that subtree's state; change how children are derived and what a plugin's routes see moves.

## Does not hit — the wrong neighbour
- `hooks` — a reader assumes a hook (or decorator) added in a child plugin mutates the root, so editing
  child registration changes the parent's hooks. It does not: `addHook` writes to the child instance's own
  `[kHooks]`, shadowed by `Object.create`. Registrations inherit *downward* only; they never bubble up.
