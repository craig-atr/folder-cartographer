---
noun: crm-server
state: live
catalog: the Express entrypoint — wires 15 route factories, mounts them under /api
source: server/server.js:193, server/server.js:281
hits: external-api, tenant-auth
misses: firestore-rules
---

## What it is
The one process the container runs (`Dockerfile:108` → `node server/server.js`). It builds shared
dependencies once — a Firestore handle, the auth middleware, an email transporter — then constructs
each route as a **factory**: `require('./routes/external')({ db, admin, ... })` (`server.js:193`) and
mounts the results under `/api`, `/tiktok`, and `/twilio` (`server.js:281`). It also serves the built
client and `/uploads`.

## Why it is shaped this way
Routes are factories, not bare routers, so every route gets its dependencies injected instead of each
one re-importing Firebase and re-reading env. That is why a new route file does nothing until it is
constructed and mounted **here** — the wiring lives in this file, not in the route.

## Hits — change this, these move
- `external-api` and every other route — they exist only because this file constructs and mounts them; change the mount prefix or a shared dependency and every route moves at once.
- `tenant-auth` — this file builds the middleware (`createAuthMiddleware(admin, db)`) and passes it into the protected routes; change how it is constructed and every guarded endpoint changes.

## Does not hit — the wrong neighbour
- `firestore-rules` — a reader assumes "the server decides who can read the data." It does not. The database enforces `firestore.rules` independently; you can rewrite every line of this server and a browser talking straight to Firestore is still governed only by the rules. The server is one guard, not the guard.
