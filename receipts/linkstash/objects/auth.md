---
noun: auth
state: live
catalog: the write-token gate; wraps POST/DELETE, never GET
source: auth.js:9, server.js:22
hits: server
misses: store
---

## What it is
One function, `requireToken(req)`, that compares the request's `Authorization: Bearer` value against
the `LINKSTASH_TOKEN` env var and returns a boolean (`auth.js:9`). It is called from `guard()` in the
server, which rejects with 401 when the check is false (`server.js:22`). Only the write routes are
wrapped; GET is registered without `guard()`.

## Why it is shaped this way
The gate is a plain predicate, not middleware — so the *policy* (which routes need it) lives visibly in
`server.js` at mount time, and the *check* (how a token is verified) lives here. Reads are public by
design, so the read route deliberately never calls this.

## Hits — change this, these move
- `server` — every guarded route runs `requireToken` through the `guard()` wrapper. Change what counts as a valid token, or the header it reads, and all of POST/DELETE `/links` change at once (`server.js:20–28`).

## Does not hit — the wrong neighbour
- `store` — a reader assumes "auth protects the data," so editing auth must touch persistence. It does
  not: `requireToken` only returns true or false *before* a handler runs; it never reads or writes the
  JSON file. Change the token logic and `store.js` is untouched — an unguarded route would reach the
  store just the same.
