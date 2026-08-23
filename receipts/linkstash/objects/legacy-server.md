---
noun: legacy-server
state: leftover
catalog: the pre-split monolith, superseded by server.js, wired by nothing
source: legacy-server.js:22, package.json:5
misses: server
---

## What it is
The single-file original, kept in the tree from before linkstash was broken into separate modules: a
`server.js` entrypoint, a `router.js`, the `auth.js` gate, `links.js` handlers, and `store.js`. It still
boots its own `http` server (`legacy-server.js:22`) and answers a read-only `/links`. But nothing
requires it, and `package.json` `main` resolves to `server.js` (`package.json:5`), so it never sits on
the running path.

## Why it is shaped this way
It is honest residue: kept in the tree for reference after the refactor rather than deleted. It is a
**leftover**, not a ghost — nothing points at it, so it is inert. No reader trusts a name that resolves
to it, because nothing imports it. (A ghost, by contrast, is trusted *and* wrong — see `rate-limit`.)

## Hits — change this, these move
- Nothing. Editing `legacy-server.js` changes only what a manual `node legacy-server.js` would run; no route, require, or `package.json` script reaches it. Deleting it would move nothing either.

## Does not hit — the wrong neighbour
- `server` — the shared word "server" makes a reader assume this is an older copy still imported by, or
  falling back from, `server.js`. It is not wired to it at all: booting it would just try to bind the
  same port and lose. The live entrypoint is `server.js`, full stop.
