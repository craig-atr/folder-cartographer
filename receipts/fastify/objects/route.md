---
noun: route
state: live
catalog: route registration; builds a per-route Context on a shared find-my-way
source: lib/route.js:210, fastify.js:99
hits: context
misses: plugin-override
---

## What it is
`buildRouting` returns a closure bundle over one shared `find-my-way` radix router (`fastify.js:99`), and
`route({ options, isFastify })` (`lib/route.js:210`) is the registration path every `fastify.get/post/route`
shorthand funnels into. It validates options, builds a per-route `Context`, and registers the URL on
find-my-way with that context attached.

## Why it is shaped this way
The router is created once per root and shared, but `route` runs with the *encapsulated* `this`, so each
route's `Context` captures its plugin subtree's hooks, decorators, and schema. Closures keep the find-my-way
instance private to the routing module.

## Hits — change this, these move
- `context` — registration constructs one `Context` per route (`lib/route.js:341`) and hands it to find-my-way; change what `route` bakes in and the per-route snapshot the hot path reads moves.

## Does not hit — the wrong neighbour
- `plugin-override` — a reader assumes "route added" means "plugin mounted," so changing route timing
  changes plugin boot. It does not: `route` runs *synchronously* when its enclosing plugin executes, but
  the plugin's execution is itself deferred by avvio's boot queue. `route` never drives that queue; it just
  runs whenever avvio reaches the plugin.
