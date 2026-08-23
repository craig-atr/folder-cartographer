---
noun: lazyrouter
state: live
catalog: builds the app's single top-level Router on first use, cached on _router
source: lib/application.js:144, lib/application.js:146
hits: router
misses: application
---

## What it is
A guard method that constructs the application's one top-level `Router` the first time it is needed and
caches it on `this._router` (`application.js:144`, `:146`). It seeds that router with the `query` parser
and `middleware.init`, then every later `use` / verb / `handle` call reuses the cached instance. So
`_router` is created exactly once, lazily.

## Why it is shaped this way
The router must read the `case sensitive routing` and `strict routing` settings, and a user may set those
*after* `require('express')()` but before the first route. Deferring construction to first use means the
router is built with the settings that are actually in force, not the defaults at app-creation time.

## Hits — change this, these move
- `router` — this is the only place `new Router(...)` runs for the app (`application.js:146`); change what it passes (options, the seeded `init`/`query`) and the app's live router changes.

## Does not hit — the wrong neighbour
- `application` — a reader assumes the router is built in the app's constructor (`createApplication` /
  an `init`), so they look there to change router options. It is not: construction is deferred here, and
  the constructor leaves `_router` undefined until the first routing call trips this guard.
