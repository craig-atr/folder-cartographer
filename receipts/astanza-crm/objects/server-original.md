---
noun: server-original
state: leftover
catalog: the pre-refactor monolith; superseded by server.js, wired by nothing
source: server/server.original.js:1
misses: crm-server
---

## What it is
An older, single-file version of the server, kept in place next to the live one under the name
`server.original.js`. It is real, working-looking code — which is exactly why it is worth marking. It
is **leftover, not a ghost**: nothing points at it. The container runs `server/server.js`
(`Dockerfile:108`), `server/package.json` sets `main: server.js`, and no file requires
`server.original`. It is honest residue from the refactor that split the monolith into route factories.

## Why it is shaped this way
When the monolith was broken into `routes/`, `services/`, and `utils/`, the original was renamed rather
than deleted — a safety copy. Nobody removed it because it never ran, so it never broke anything.

## Hits — change this, these move
- Nothing. Editing or deleting `server.original.js` changes no running behaviour — that is the test that confirms it is leftover, not live.

## Does not hit — the wrong neighbour
- `crm-server` — a reader greps "server", opens this because the name looks canonical, and starts reading the wrong file. The live server is `server.js`; this one is a fossil. Changes here never reach production, and the two files have already drifted — trusting this one describes a world that no longer runs.
