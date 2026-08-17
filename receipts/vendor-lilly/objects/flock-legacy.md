---
noun: flock / single-tenant remnants
state: ghost
catalog: names from the pre-multi-tenant origin, still in the source
source: backend/src/middleware/tenantMiddleware.js:11, docs/migration-plan.md:3
misses: tenant-middleware
---

## What it is
Residue from Vendor Lilly's origin as the single-tenant **Flock & Flourish** vendor portal, since
"extracted, generalised, and restructured for multi-tenancy" (README). The name survives in the
source: the worked example slug in `tenantMiddleware.js:11` is literally `"flock"`, and
`docs/migration-plan.md` still describes the single-tenant world. These are **names, not wiring** —
a tripwire, not a live tenant.

## Why it is shaped this way
A migration leaves its birth name in comments, example values, and planning docs long after the
architecture has moved on. Nobody removed "flock" because it never broke anything — which is
exactly what makes it a ghost: harmless to run, misleading to read.

## Hits — change this, these move
- Nothing at runtime. Renaming the example slug or deleting the migration doc changes no behavior — that is the test that confirms this is a ghost, not a live noun.

## Does not hit — the wrong neighbour
- The live tenant resolution. Everyone who greps "flock" assumes it is a real, special tenant. It is not — tenants are resolved by `X-Tenant-ID` / slug at runtime (`tenantMiddleware.js:34`), and `"flock"` is just the doc-comment's example. Treating it as a live tenant, or as a magic default, implements a world that does not exist.
