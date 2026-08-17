# reference — naming collisions

A collision is **one word that means two different things** in the same territory. Chat is not
always Chat. A cold reader who does not know the collision opens the wrong card, edits the wrong
noun, and ships the wrong world. Every map records its territory's collisions in the catalog and
here.

## How to hunt collisions

1. Grep the territory for repeated stems (`admin`, `app`, `tenant`, `user`, `client`, `config`).
2. For each, list every distinct thing that wears the name — file, route, role, collection, var.
3. If two of them are genuinely different nouns, it is a collision. Write down which is which and
   how to tell them apart (path, mount point, auth level).

## The worked example — Vendor Lilly (`receipts/vendor-lilly/`)

These are real, cited from the source. They are the reason the map is walkable — a reader who
skips them will guess wrong on the first hop.

- **admin** — three different things.
  - `requireAdmin` = a **tenant** admin (a user with `role == 'admin'` inside one tenant).
  - `requirePlatformAdmin` = a **platform** operator (a doc in `/platformAdmins`, across all tenants).
  - `/tenant` vs `/platform` are the two admin *surfaces*. Cite: `backend/src/middleware/` +
    `backend/src/server.js:87–94`. Editing "admin" auth means nothing until you know which one.

- **the app** — two React apps in one frontend.
  - `App.jsx` = the **tenant portal** (what a vendor/market sees).
  - `PlatformAdminApp.jsx` = the **platform console** (what the operator sees).
  - Cite: `frontend/src/App.jsx`, `frontend/src/PlatformAdminApp.jsx`.

- **tenant** — the most overloaded word here. It is a route (`/tenant`), a middleware
  (`tenantMiddleware`), a service (`tenantService`), a frontend context (`TenantContext`), and a
  Firestore document (`/tenants/{id}`) that holds Square credentials. They are related but not the
  same noun; a card is about exactly one of them.

- **tenant resolution** — two mechanisms, easy to conflate.
  - The API resolves the tenant from the **`X-Tenant-ID` header** (`tenantMiddleware.js:35`).
  - The **webhooks** resolve it from the **URL slug** via `getTenantBySlug` (`tenantMiddleware.js:14`),
    because Square/Stripe cannot send a custom header.

- **Square** — `squareService` (the client that calls Square's API) vs the `/webhooks/square`
  route (what Square calls back into). Different direction of traffic, same word.

- **flock** — a ghost worth knowing. The example slug in the code is literally `"flock"`
  (`tenantMiddleware.js:11`), a leftover of the single-tenant **Flock & Flourish** origin. Seeing
  "flock" in the source does not mean flock is a live tenant — it is documentation residue.
