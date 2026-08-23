---
noun: fstdep022
state: ghost
catalog: top-level router option keys that still work but warn and are slated for removal
source: lib/warnings.js:44, lib/route.js:677
misses: route
---

## What it is
`FSTDEP022` is the one live deprecation code in Fastify 5 (`lib/warnings.js:44`). Top-level router option
keys still function — `buildRouterOptions` reads them — but reading one emits `FSTDEP022`
(`lib/route.js:677`) and the keys are slated for removal in `fastify@6`. The blessed home is now
`options.routerOptions`. The ghost is the gap: the old keys *work today*, so a reader trusts them, while the
warning says they are already on the way out.

## Why it is shaped this way
Fastify keeps a numbered deprecation registry (FSTDEP001–021 were burned in v4 and must not be reused) so a
deprecation is announced for a full major before the behaviour is removed. `FSTDEP022` is that grace period:
working code plus a warning, which is exactly what makes it a tripwire rather than an error.

## Hits — change this, these move
- Nothing on the running path. The keys still resolve, so editing them changes behaviour today — but building against them is building on a name scheduled to disappear; the warning is the only thing that fires.

## Does not hit — the wrong neighbour
- `route` — a reader sees the top-level router keys accepted by `route` registration and assumes they are the
  supported, stable surface. They are not: the supported home is `options.routerOptions`, and the top-level
  keys survive only under the `FSTDEP022` warning until `fastify@6` removes them.
