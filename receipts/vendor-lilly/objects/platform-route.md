---
noun: /platform route
state: live
catalog: the platform-operator surface, above all tenants
source: backend/src/server.js:94, backend/src/middleware/requirePlatformAdmin.js:13
---

## What it is
The router for the platform operator — the person who runs Vendor Lilly itself, not any one
tenant. It is mounted **without** `tenantMiddleware` (`server.js:94`) because it operates across
all tenants, and it is gated by `requirePlatformAdmin` (membership in the `/platformAdmins`
collection), a different check from the per-tenant `requireAdmin`.

## Why it is shaped this way
There are two kinds of admin, and conflating them is a security hole. A tenant admin manages one
market's vendors; a platform admin creates tenants and holds Square credentials. `/platform` is
the second one's surface, deliberately outside the tenant scope so it can act on any tenant.

## Hits — change this, these move
- The platform console — `PlatformAdminApp.jsx` talks to this router; change its endpoints and the operator UI changes.
- Tenant creation/config — platform-admin actions write the `/tenants/{id}` docs that every tenant-scoped request later reads.

## Does not hit — the wrong neighbour
- The `/tenant` route and `requireAdmin`. Everyone reaches for "admin route = the admin API." This is the **platform** admin, not the **tenant** admin — different middleware (`requirePlatformAdmin` vs `requireAdmin`), different app (`PlatformAdminApp.jsx` vs `App.jsx`), no tenant scoping. Editing `/platform` does not change what a tenant's own admin can do.
