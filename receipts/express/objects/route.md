---
noun: route
state: live
catalog: the inner, per-verb dispatch for one matched path
source: lib/router/route.js:101, lib/router/route.js:43
hits: layer
misses: router
---

## What it is
A `Route` owns one path and its own `stack` of method-tagged `Layer`s (`route.js:43`). `Route#dispatch`
(`route.js:101`) walks that inner stack, running the handlers whose method matches the request (`GET`,
`POST`, …). The per-verb methods `route.get` / `route.post` / … are generated in a loop over the `methods`
list, each pushing a `Layer` tagged with its verb.

## Why it is shaped this way
A route is a second dispatch level so one path can carry several verb handlers plus route-scoped
middleware. It lets the `router` delegate the "which verb" decision downward: the router picks the route,
the route picks the handler for the method.

## Hits — change this, these move
- `layer` — every verb handler and `route.all` is pushed onto the route's stack as a `new Layer`, and `dispatch` runs them; change the route and you change the `Layer`s it builds and walks.

## Does not hit — the wrong neighbour
- `router` — a reader assumes editing a `Route` changes routing / path matching (the router's job). It
  does not: by the time `Route#dispatch` runs, the path has already matched up in the router's walk. The
  route only filters its own handlers by HTTP method; it never re-matches the URL.
