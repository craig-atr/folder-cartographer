---
noun: server
state: live
catalog: the http entrypoint; wires the router and mounts auth on writes only
source: server.js:9, server.js:14, server.js:30
hits: router, auth
misses: legacy-server
---

## What it is
The single entrypoint that boots the service. It builds one router
(`server.js:9`), registers the three `/links` routes on it, and stands up a `node:http` server that
dispatches each request to the matched handler (`server.js:30`). The write routes are registered
wrapped in `guard()`; the read route is registered bare (`server.js:12–15`).

## Why it is shaped this way
Auth is decided once, at mount time, not inside each handler — a route is either registered through
`guard()` or it is not, so you can read the trust boundary straight off the three `router.add` lines.
The `http`/router split keeps dispatch (`router.js`) separate from what boots and what is guarded.

## Hits — change this, these move
- `router` — the server owns the only `createRouter()` and every `router.add`; change how it mounts and dispatch behaviour changes (`server.js:9,12–15`).
- `auth` — which routes are guarded is decided *here*, by wrapping a handler in `guard()` or not. Move a route in or out of `guard()` and its trust changes, with no edit to `auth.js`.

## Does not hit — the wrong neighbour
- `legacy-server` — a reader greps "server", finds `legacy-server.js`, and assumes editing it changes
  the running service. It does not: nothing requires `legacy-server.js` and `package.json` `main` is
  `server.js` (`package.json:5`). It is an unwired copy — see its card.
