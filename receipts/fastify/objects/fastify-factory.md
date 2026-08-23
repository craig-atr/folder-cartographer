---
noun: fastify-factory
state: live
catalog: the factory - assembles one root instance as Symbol-keyed state
source: fastify.js:89, fastify.js:120
hits: hooks, reply
misses: route
---

## What it is
`function fastify(serverOptions)` (`fastify.js:89`) is the top-level factory: it assembles one root server
instance, building the router, HTTP server, schema controller, hooks, content-type parser, and the
`Reply` / `Request` constructors, then hangs them off a plain object (`fastify.js:120`) as `Symbol`-keyed
private state plus public methods, and wires avvio onto it before returning it.

## Why it is shaped this way
Fastify uses a plain object with `Symbol`-keyed fields (`[kState]`, `[kHooks]`, `[kReply]`, …) rather than a
class, so children can be produced by `Object.create` for encapsulation while the private fields stay hidden
from user code. The factory is the one place that assembly order is fixed.

## Hits — change this, these move
- `hooks` — the factory constructs the per-instance store here (`[kHooks]: new Hooks()`); change the assembly and the hook store the whole instance shares moves.
- `reply` — it builds the per-instance `Reply` subclass (`[kReply]: Reply.buildReply(Reply)`); change what it constructs and every reply on this instance changes.

## Does not hit — the wrong neighbour
- `route` — the factory exposes a `route` *method*, so a reader assumes route-registration logic lives in
  the factory. It does not: that method only forwards to `lib/route.js`. Editing the factory changes how an
  instance is *assembled*, not how a route is *registered* — that logic is entirely in the `route` noun.
