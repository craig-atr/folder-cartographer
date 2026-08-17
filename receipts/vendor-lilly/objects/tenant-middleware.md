---
noun: tenantMiddleware
state: live
catalog: resolves the current tenant; the multi-tenancy spine
source: backend/src/server.js:87, backend/src/middleware/tenantMiddleware.js:34
hits: vendor-matcher
misses: public-route, platform-route
---

## What it is
The middleware that turns a bare request into a *tenant-scoped* one. It reads the `X-Tenant-ID`
header, loads that tenant's document from Firestore, and attaches `req.tenant` and `req.tenantId`
for everything downstream (`tenantMiddleware.js:34`). It is mounted in front of the routes that
must be scoped to one tenant: `/debug`, `/access-requests`, and `/tenant` (`server.js:87–89`).

## Why it is shaped this way
Multi-tenancy is enforced at one seam instead of in every handler. Because the tenant document it
loads carries the tenant's Square credentials, every scoped route gets those credentials without
each one re-reading them — and no route can accidentally serve a request that was never scoped.

## Hits — change this, these move
- `/debug`, `/access-requests`, `/tenant` — all three are mounted *through* it (`server.js:87–89`); change how it resolves or what it attaches and every handler on those routes sees it.
- `req.tenant` / `req.tenantId` — the shape every scoped handler reads; renaming or re-scoping these ripples into all of them.

## Does not hit — the wrong neighbour
- `/public`, `/webhooks/square`, `/webhooks/stripe`, `/platform` — everyone assumes "all requests go through tenant middleware." These four are mounted **without** it (`server.js:74,80,81,94`): `/public` is pre-login, the webhooks resolve their tenant from the URL slug instead of the header, and `/platform` operates *above* any single tenant. Changing `tenantMiddleware` does not touch them.
