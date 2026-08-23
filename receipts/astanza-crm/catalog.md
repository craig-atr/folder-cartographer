# Catalog — Astanza CRM (the server spine, live vs. leftover)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: `astanza-crm` — a multi-tenant CRM for tattoo-removal clinics (Express + Firebase).
> The repo root is a **junk drawer**: ~30 loose `test-*` / `debug-*` / `seed-*` / `fix-*` scripts
> and a dozen design docs sit next to the real app. This map is small on purpose — the **7 nouns a
> reader must hold before changing how a clinic's data flows**, and which of the loose files are
> **live, leftover, or a ghost.** The feature routes (stripe, tiktok, sms, images, email, trend-radar)
> and all patient data are off this map on purpose — see `run-notes.md`.

| noun | state | what | card |
|---|---|---|---|
| crm-server | live | the Express entrypoint; wires 15 route factories, mounts them under `/api` | [objects/crm-server.md](objects/crm-server.md) |
| external-api | live | the **public, tenant-scoped** `/api/external/*` routes other sites call into | [objects/external-api.md](objects/external-api.md) |
| tenant-auth | live | the Express middleware: verify token, require tenant member, require admin | [objects/tenant-auth.md](objects/tenant-auth.md) |
| firestore-rules | live | the **database-layer** tenant isolation — a separate guard from the middleware | [objects/firestore-rules.md](objects/firestore-rules.md) |
| server-original | **leftover** | the pre-refactor monolith; superseded by `server.js`, wired by nothing | [objects/server-original.md](objects/server-original.md) |
| root-ops-scripts | **leftover** | the drawer of one-off `test-`/`debug-`/`seed-`/`fix-` scripts at the root | [objects/root-ops-scripts.md](objects/root-ops-scripts.md) |
| firestore-indexes | **ghost** | an empty index config a reader trusts as the source of truth for indexes | [objects/firestore-indexes.md](objects/firestore-indexes.md) |

## Collisions — read before you walk (full method in `../../reference/collisions.md`)

- **server** → `server/server.js` (the live entrypoint — `Dockerfile:108` runs it) vs
  `server/server.original.js` (the superseded monolith) vs the ~30 root scripts that each boot their
  own Firebase Admin. A reader who greps "server" lands on the wrong one first.
- **auth / isolation** → **three independent guards**: the Express middleware (`middleware/auth.js`,
  gates the `/api` routes), `firestore.rules` (gates the database directly), and `storage.rules`
  (gates file storage). Changing one does **not** change the others.
- **external** → `routes/external.js` (public, tenant-scoped, no login — what marketing sites call)
  vs every other `/api` route (Firebase-token + tenant-member gated). Same server, opposite trust.
- **tenant** → the `:tenantId` URL param, the `tenants/{tenantId}` Firestore path, and
  `requireTenantMember` are related, not one noun. `atomictattooremoval` is **one tenant** — the site
  in the sibling `atomic-tattoo-removal` receipt is a *client* of this CRM.
- **package.json** → the **root** one (`tattooremoval-crm`, a loose bag of script deps: grammy,
  openai, firebase-tools) vs `server/package.json` (the real app, `main: server.js`). The root is not
  the app.
