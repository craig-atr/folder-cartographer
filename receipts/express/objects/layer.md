---
noun: layer
state: live
catalog: the match-and-invoke primitive both stacks are made of
source: lib/router/layer.js:33, lib/router/layer.js:110
hits: router, route
misses: application
---

## What it is
The atomic unit of both dispatch stacks (`layer.js:33`). A `Layer` pairs one compiled `path-to-regexp`
matcher with one handler function, plus `handle_request` / `handle_error` wrappers that call the fn with
the right arity. `Layer#match` (`layer.js:110`) runs the compiled regexp against a path. `Router.stack`
and `Route.stack` are both just arrays of `Layer`s.

## Why it is shaped this way
Factoring match-and-invoke into one reusable object lets middleware, mounted routers, and per-verb route
handlers share identical matching and error semantics — the two dispatch loops (`Router#handle`,
`Route#dispatch`) call the same primitive, so behaviour can't drift between them.

## Hits — change this, these move
- `router` — `Router#handle` consults `layer.match` and `layer.handle_request` on every step of its walk.
- `route` — `Route#dispatch` walks its own array of `Layer`s the same way; both stacks are made of this.

## Does not hit — the wrong neighbour
- `application` — a reader assumes path-matching is configured up at the application (where routes are
  declared), so they edit application code to change how a URL matches. It is the wrong door: the compiled
  matcher lives on the `Layer`. Change `Layer#match` and matching changes everywhere; change the
  application and it does not.
