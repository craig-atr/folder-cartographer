---
noun: tenant-auth
state: live
catalog: the Express middleware — verify token, require tenant member, require admin
source: server/middleware/auth.js:35, server/middleware/auth.js:68
hits: crm-server
misses: firestore-rules
---

## What it is
The factory `createAuthMiddleware(admin, db)` that returns `verifyFirebaseToken`, `requireTenantMember`
(`auth.js:35`), `requireAdmin` (`auth.js:68`), and `authenticateApiKey`. `requireTenantMember` takes a
function that extracts the tenant id from the request, then confirms the caller is an approved member
of that tenant before the handler runs. It is the gate on the *authenticated* `/api` routes.

## Why it is shaped this way
It is a factory because it needs the same injected `db`/`admin` as everything else, and it takes the
tenant-id extractor as an argument so one guard works whether the tenant is in the URL, the body, or a
header. Membership is checked per request because a user can belong to some tenants and not others.

## Hits — change this, these move
- `crm-server` — the server constructs this once and threads it into intake, medical-form, images, email, admin, and the tiktok routes; loosen or tighten a check here and every one of those protected endpoints changes behaviour at once.

## Does not hit — the wrong neighbour
- `firestore-rules` — the word everyone reaches for is "this is where tenant isolation lives." It is where the **API's** isolation lives. The database has its own, separate isolation in `firestore.rules`, and a client that talks straight to Firestore (an admin dashboard, a script) never passes through this middleware at all. Editing this file does not change one line of what the database itself permits.
