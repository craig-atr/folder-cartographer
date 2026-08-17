# examples — one worked map

A single worked map of a real territory: **Vendor Lilly**, a multi-tenant vendor-portal SaaS.
The full produced map lives in [`receipts/vendor-lilly/`](receipts/vendor-lilly/); this file
walks it so you can see the rules from `rules.md` actually firing. Small on purpose — six cards.

## The catalog (the front door)

The reader loads exactly this first ([`receipts/vendor-lilly/catalog.md`](receipts/vendor-lilly/catalog.md)):

| noun | state | what |
|---|---|---|
| tenantMiddleware | live | resolves the current tenant; the multi-tenancy spine |
| firestore.rules | live | tenant isolation; keeps Square creds off the client |
| /public route | live | the only unauthenticated door; serves tenant config, creds stripped |
| /platform route | live | the platform-operator surface, above all tenants |
| vendorMatcher | live | per-tenant vendor lookup + cache |
| flock / single-tenant remnants | **ghost** | names from the pre-multi-tenant origin, still in the source |

…plus a collisions list (admin, the app, tenant, Square). Two hops from here to any answer.

## Two noun cards (abridged — full text in `objects/`)

**tenantMiddleware** (live) — *what:* reads `X-Tenant-ID`, loads the tenant doc, attaches
`req.tenant` (`server.js:87`, `tenantMiddleware.js:34`). *Hits:* `/debug`, `/access-requests`,
`/tenant` — all mounted through it. **Does not hit:** `/public`, `/webhooks/*`, `/platform` —
mounted **without** it (`server.js:74,80,81,94`). That last line is the map: the word everyone
reaches for ("everything goes through tenant middleware") is exactly the wrong one.

**firestore.rules** (live) — *what:* the tenant doc holds Square creds and is not client-readable
(`firestore.rules:41,36`). **Does not hit:** "the frontend reads `/tenants/{id}` directly" — it
cannot; config flows through `GET /public/tenant/:slug`, creds stripped.

## One ghost

**flock / single-tenant remnants** (ghost) — the example slug in the code is literally `"flock"`
(`tenantMiddleware.js:11`), residue of the single-tenant Flock & Flourish origin. It is a **name,
not wiring**: renaming it changes nothing at runtime. A reader who greps "flock" and assumes it is
a live or magic tenant implements a world that does not exist. That is why ghosts get marked.

## One change, and what it hits

*"I need to change how the current tenant is resolved."* The reader opens **one** card —
`tenant-middleware.md` — and learns: it hits the three scoped routes and the `req.tenant` shape,
and it does **not** hit `/public`, the webhooks, or `/platform` (the webhooks resolve tenants by
slug, not header). They can make the change without opening the other five cards. Catalog → one
card → stop.
