# Catalog — linkstash (the request spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: `linkstash` — a tiny zero-dependency link-saving JSON API (Node `http`, a flat JSON
> file). **The territory ships in this receipt** (`receipts/linkstash/territory/`), so every
> citation and the live-wiring gate resolve **cold** — no private repo needed (see `run-notes.md`).
> Mapped: the six nouns a reader must hold before changing how a link gets saved.

| noun | state | what | card |
|---|---|---|---|
| server | live | the `http` entrypoint; wires the router and mounts auth on writes only | [objects/server.md](objects/server.md) |
| router | live | method+path dispatch; finds the handler for a request | [objects/router.md](objects/router.md) |
| auth | live | the write-token gate; wraps POST/DELETE, never GET | [objects/auth.md](objects/auth.md) |
| store | live | the only code that reads/writes the JSON file on disk | [objects/store.md](objects/store.md) |
| rate-limit | **ghost** | config says `enabled: true`, but nothing on the running path reads it | [objects/rate-limit.md](objects/rate-limit.md) |
| legacy-server | **leftover** | the pre-split monolith; superseded by `server.js`, wired by nothing | [objects/legacy-server.md](objects/legacy-server.md) |

## Collisions — read before you walk (method in `../../reference/collisions.md`)

- **server** → `server.js` (the live entrypoint — `package.json` `main`) vs `legacy-server.js`
  (the superseded monolith). Grep "server" and you land on the wrong one first.
- **guard / auth** → `requireToken` in `auth.js` (the check) vs `guard()` in `server.js` (the
  wrapper that *applies* it). The router does not authenticate; the wrapping happens at mount time.
- **rate limit** → `config.rateLimit` (the promise, `enabled: true`) vs `ratelimit.js` (a real
  implementation) vs the running server (which mounts neither). Same name, three places, zero effect.
- **links** → `links.js` (the handlers) vs `links.json` (the data on disk) vs the `/links` route.
  Related, not one noun.
