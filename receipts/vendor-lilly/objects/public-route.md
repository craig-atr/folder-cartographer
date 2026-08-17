---
noun: /public route
state: live
catalog: the only unauthenticated door; serves tenant config, creds stripped
source: backend/src/server.js:74, backend/src/routes/public.js:18
misses: tenant-middleware
---

## What it is
The one router mounted with no auth and no tenant middleware (`server.js:74`). It serves what a
browser needs *before* anyone logs in: `GET /public/tenant/:slug` returns a tenant's public
config with Square credentials intentionally omitted (`public.js:18` and the comment at
`public.js:14`), plus email/subdomain lookups and the Stripe checkout-session creator.

## Why it is shaped this way
The frontend cannot read the tenant document directly (the rules forbid it), but it still needs
branding, subdomain, and public settings to render the login page. `/public` is the sanctioned
hole in the wall: a backend endpoint using the Admin SDK that returns only the safe fields.

## Hits — change this, these move
- The pre-login frontend — the landing/login pages resolve their tenant through `GET /public/tenant/:slug`; change its shape and they change.
- Stripe checkout — `create-checkout-session` lives here (`public.js:120`), so the signup-to-payment flow depends on this router.

## Does not hit — the wrong neighbour
- Tenant-scoped data. Everyone assumes "public means the public API for the tenant." It is **not** scoped by `tenantMiddleware` (`server.js:74` mounts it without) — it must not, because it runs pre-login. Anything that needs `req.tenant` belongs on `/tenant`, not here; adding a scoped feature to `/public` gets you an unauthenticated leak, not a convenience.
