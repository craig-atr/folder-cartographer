# Catalog — Vendor Lilly (backend spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: `vendor-lilly` — a multi-tenant vendor-portal SaaS. Mapped: the backend request
> spine (the nouns a reader must hold before changing how a tenant's data flows). The frontend,
> the services' internals, and the tests are off this map on purpose — see `run-notes.md`.

| noun | state | what | card |
|---|---|---|---|
| tenantMiddleware | live | resolves the current tenant; the multi-tenancy spine | [objects/tenant-middleware.md](objects/tenant-middleware.md) |
| firestore.rules | live | tenant isolation; keeps Square creds off the client | [objects/firestore-rules.md](objects/firestore-rules.md) |
| /public route | live | the only unauthenticated door; serves tenant config, creds stripped | [objects/public-route.md](objects/public-route.md) |
| /platform route | live | the platform-operator surface, above all tenants | [objects/platform-route.md](objects/platform-route.md) |
| vendorMatcher | live | per-tenant vendor lookup + cache | [objects/vendor-matcher.md](objects/vendor-matcher.md) |
| flock / single-tenant remnants | ghost | names from the pre-multi-tenant origin, still in the source | [objects/flock-legacy.md](objects/flock-legacy.md) |

## Collisions — read before you walk (full list in `../../reference/collisions.md`)

- **admin** → `requireAdmin` (tenant admin) vs `requirePlatformAdmin` (platform operator) vs the `/tenant` vs `/platform` surfaces.
- **the app** → `App.jsx` (tenant portal) vs `PlatformAdminApp.jsx` (platform console).
- **tenant** → the `/tenant` route, `tenantMiddleware`, `tenantService`, `TenantContext`, and the `/tenants/{id}` doc — related, not the same noun.
- **tenant resolution** → `X-Tenant-ID` header (API) vs URL slug (webhooks).
- **Square** → `squareService` (calls out) vs `/webhooks/square` (calls in).
