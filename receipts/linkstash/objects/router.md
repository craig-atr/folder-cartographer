---
noun: router
state: live
catalog: method+path dispatch; finds the handler for a request
source: router.js:12, server.js:32
hits: server
misses: auth
---

## What it is
A minimal dispatcher. Handlers register with `add(method, pathname, handler)`; `match()` returns the
first route whose method and path both equal the request's, or `null` (`router.js:12`). The server
calls `router.match(req.method, url.pathname)` once per request and invokes the handler it returns
(`server.js:32`).

## Why it is shaped this way
Exact method+path matching, no framework — the whole route table is the three `router.add` calls in
`server.js`, so a reader can see every endpoint in one place. `match()` returning `null` is what the
server turns into a 404.

## Hits — change this, these move
- `server` — the server's request loop depends on `match()`'s contract (method+path in, route-or-`null` out). Change the matching semantics — add wildcards, change the null case — and the dispatch in `server.js:32–37` changes with it.

## Does not hit — the wrong neighbour
- `auth` — because requests flow *through* the router, a reader assumes the router enforces the write
  token. It does not: `match()` has no auth logic (`router.js` says so on its own). Guarding is applied
  by wrapping handlers in `server.js`, before they are ever registered — the router only finds a
  handler, it never checks who you are.
