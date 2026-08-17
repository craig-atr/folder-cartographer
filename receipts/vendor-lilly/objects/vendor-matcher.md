---
noun: vendorMatcher
state: live
catalog: per-tenant vendor lookup + cache
source: backend/src/services/vendorMatcher.js:8, backend/src/services/vendorMatcher.js:6
---

## What it is
The service that resolves vendors for a tenant and caches them in memory. `getVendors(tenantId)`
loads the tenant's `vendors` collection from Firestore and stores the result in a per-tenant
in-process cache keyed by `tenantId` (`vendorMatcher.js:6,8`), with a TTL and an explicit
invalidation call to force a reload.

## Why it is shaped this way
Vendor lists are read constantly (every catalog view, every match) but change rarely, so they are
cached. The cache is keyed **per tenant** so one market's vendors never bleed into another's — the
same isolation the rules enforce in the database, held in memory here.

## Hits — change this, these move
- Anything that resolves a vendor for a request — catalog/inventory reads that call `getVendors` see stale data until the TTL or the invalidation fires.
- Memory footprint — the cache holds every active tenant's vendors at once; changing the TTL changes how long each tenant lingers in memory.

## Does not hit — the wrong neighbour
- The `vendors` Firestore collection's contents. Everyone assumes "the matcher owns the vendors." It only **reads and caches** them (`vendorMatcher.js:15`); writes to vendors happen through the tenant/admin routes. Editing the matcher changes lookup and caching, not what a vendor record *is*.
