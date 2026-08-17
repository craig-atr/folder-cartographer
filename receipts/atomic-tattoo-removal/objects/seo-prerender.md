---
noun: seo-prerender
state: live
catalog: snapshots static routes to dist/<route>/index.html for crawlers
source: client/seo-routes.mjs:5, client/prerender.mjs:82
hits: express-server
misses: booking-routes
---

## What it is
A post-build step that renders the real app in headless Chrome and writes one
`dist/<route>/index.html` per static route (`prerender.mjs:82`), so crawlers that do not run JS see
real titles and meta tags. Its route list lives in one place, `seo-routes.mjs` (`seo-routes.mjs:5`),
which is also imported by `verify-seo.mjs` to check the snapshots exist. Dynamic and auth routes
(`/admin`, `/book-consultation`, `/blog/:slug`, the contests) are intentionally excluded.

## Why it is shaped this way
The route list is a single exported constant so the prerenderer and the verifier can never disagree
about which pages are "static." One source of truth is what keeps a page from silently dropping out
of the crawlable set.

## Hits — change this, these move
- `express-server` — the snapshots are inert until the server's `*` fallback chooses them over the SPA shell; the two are one mechanism split across build-time and request-time. Add a route here and you must also let the server find it.

## Does not hit — the wrong neighbour
- `booking-routes` — a reader assumes prerendering "covers the whole site, including the booking and admin pages." It does not: those routes are deliberately left client-rendered. Adding a route to `seo-routes.mjs` never creates or changes an `/api` endpoint, and changing an endpoint never changes what gets prerendered.
