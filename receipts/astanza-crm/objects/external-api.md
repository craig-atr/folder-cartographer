---
noun: external-api
state: live
catalog: the public, tenant-scoped /api/external/* routes other sites call into
source: server/routes/external.js:460, server/routes/external.js:639
misses: tenant-auth
---

## What it is
The one router whose endpoints are **public** — no Firebase login. It exposes tenant-scoped reads and
writes that other web properties call into: `GET /api/external/consultation-availability/:tenantId`
(`external.js:460`) and `POST /api/external/consultation-booking-attribution` (`external.js:639`), plus
contest image retrieval and voting. It defends itself with per-route CORS and rate limiters instead of
a login.

## Why it is shaped this way
A clinic's marketing site has to read availability and post a booking without a logged-in user, so
these routes trade the tenant-member gate for a narrower contract: a tenant id in the URL, an allowlist
CORS, and a submission limiter. That is the whole reason `external.js` is a separate file from the rest
of `/api`.

## Hits — change this, these move
- The clinics' marketing sites — the sibling `atomic-tattoo-removal` receipt's `crm-attribution` card POSTs into `/external/consultation-booking-attribution`, and its booking form reads `/external/consultation-availability/:tenantId`. Change this contract and those sites break, in a different repo, with no import to warn you.

## Does not hit — the wrong neighbour
- `tenant-auth` — everyone assumes "all `/api` routes go through the tenant-member guard." These do **not**. `external.js` is mounted under `/api` but deliberately skips `verifyFirebaseToken` / `requireTenantMember`; its protection is CORS + rate-limit + tenant-id-in-URL. Tightening the auth middleware does not touch these endpoints.
