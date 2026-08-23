---
noun: application
state: live
catalog: the app object — use / verbs / handle; owns no route stack
source: lib/application.js:165, lib/application.js:181
hits: lazyrouter, router
misses: layer
---

## What it is
The `application` prototype (`proto`) that Express mixes onto the callable `app`: it carries `use`, the
HTTP-verb methods, `param`, `listen`, and `handle`. `app.handle` is the entry point for every request
(`application.js:165`), but its body does almost nothing itself — it hands the request to the app's
`Router` (`application.js:181`). The application holds settings and delegates; it keeps no stack of
routes of its own.

## Why it is shaped this way
It is a separate object literal, not a class, so Express can mix it onto a plain function (`app`) that is
also usable as middleware and as an `http` listener. Keeping the methods thin and forwarding to a router
means one dispatch engine serves the app, mounted sub-apps, and `express.Router()` alike.

## Hits — change this, these move
- `lazyrouter` — `use`, `param`, `route`, and every verb method call `this.lazyrouter()` first; change how the application forwards and the deferred bootstrap is what you are touching.
- `router` — `app.handle` delegates to `this._router.handle` (`application.js:181`); the application is just the front door to the router's walk.

## Does not hit — the wrong neighbour
- `layer` — a reader who wants to change *how a path matches* edits the application, because that is where
  they define routes. It is the wrong door: the application never matches a path. Matching is compiled
  and run in `layer` (via `path-to-regexp`); editing application code changes forwarding, not matching.
