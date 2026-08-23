---
noun: router
state: live
catalog: the real dispatch — walks a stack of Layers and matches
source: lib/router/index.js:136, lib/router/index.js:43
hits: layer
misses: route
---

## What it is
The router factory returns a callable `router(req, res, next)` (`router/index.js:43`) whose `handle`
method is the real dispatch loop (`router/index.js:136`). `handle` walks the router's `stack` — an array
of `Layer`s — asking each `Layer` whether it matches the path, and invoking the ones that do. Because a
router is itself callable, it can be `use`d as middleware inside another router (nested / mounted apps).

## Why it is shaped this way
One dispatch loop over a flat `Layer` stack keeps middleware and mounted routers uniform: everything in
the stack is a `Layer`, so the same walk handles a plain middleware, a sub-router, and a route entry. A
callable router is what makes `app.use('/x', express.Router())` recurse.

## Hits — change this, these move
- `layer` — the walk is entirely calls to `layer.match(path)` and `layer.handle_request` / `handle_error`; change the stack walk and you change how every `Layer` is consulted.

## Does not hit — the wrong neighbour
- `route` — a reader assumes the router runs the per-verb handlers, because "the router routes." It does
  not: `Router#handle` only decides *which* `Layer` (and thus which route) matches. Running the matched
  path's verb chain is `Route#dispatch` — a second, inner loop. Change the router's walk and the per-verb
  handling is untouched.
