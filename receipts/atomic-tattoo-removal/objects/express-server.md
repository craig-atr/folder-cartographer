---
noun: express-server
state: live
catalog: the Node server — mounts /api, serves the built client, prerender-aware
source: server/server.js:22, server/server.js:53
hits: booking-routes, seo-prerender
misses: firebase-admin-console
---

## What it is
The single Express process. It mounts the booking router under `/api` (`server.js:22`), then serves
the built React app out of `client/dist` with a two-tier cache policy (content-hashed bundles are
immutable, HTML and images revalidate). Its `*` fallback (`server.js:53`) prefers a prerendered
`dist/<route>/index.html` when one exists and otherwise returns the SPA shell.

## Why it is shaped this way
One process serves both the API and the static site so there is a single deploy unit (a Cloud Run
container). The fallback is prerender-aware because crawlers need real HTML for the marketing routes
but the app is otherwise client-rendered — so the server has to choose per request which shell to send.

## Hits — change this, these move
- `booking-routes` — everything under `/api` is this mount; change the prefix or the body parsers and every endpoint moves.
- `seo-prerender` — the `*` fallback is the *only* thing that serves the prerendered snapshots; change how it resolves a route and the crawler HTML stops being delivered even though the files still exist.

## Does not hit — the wrong neighbour
- `firebase-admin-console` — everyone assumes "the server serves the admin dashboard." It does not. The server only ever hands the admin routes the same static SPA shell; the admin's *data* is read straight from Firestore in the browser and never passes through this process. Changing the server does not move the admin's data at all.
