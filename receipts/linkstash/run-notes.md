# Run notes — linkstash (the cold-verifiable receipt)

**Territory:** `linkstash` — a tiny zero-dependency link-saving JSON API (Node's built-in `http`, a
flat JSON file, no `npm install`). Reads are public; writes need a token.
**Later reader:** a cold model, or a new developer, opening the service and needing to know how a link
gets saved and what is guarded before touching either.

## Why this receipt exists — it makes the two territory-gates verify cold

The other four maps (`vendor-lilly`, `atomic-tattoo-removal`, `astanza-crm`, `arnold-android`) cite
**private** source. A cold judge can run `--selftest` and the internal gates on them, but **cannot** run
the two gates that carry the cartographer's central promise — **G3 (citations resolve, "the file wins")**
and **G9 (a `live` noun cites real wiring, not a wish)** — because those need `--territory` and those
territories are not public.

This receipt closes that. **The territory ships inside it** (`territory/`), so anyone can run the full
gate set — including G3 and G9 against a real tree — from a cold clone, no private repo required:

```bash
node verify.mjs --map receipts/linkstash --territory receipts/linkstash/territory
```

That command resolves every `file:line` (G3), confirms no card photocopies its source (G4), and reads
the line each **live** card cites to prove it lands on real wiring, not a comment or a TODO (G9). It is
the reproducible-fixture tier: a real, self-contained body of work you can point the gates at and watch
them go green — the same discipline as the private maps, now in the reader's own hands.

(It is a small service I wrote for this purpose, not a production system. It is a genuine one — six
coupled nouns with a real live/leftover/ghost story — shipped so the guarantee is *shown*, not asserted.)

## What the map teaches

- **Auth is not on every route.** The wrong neighbour a reader reaches for is "every request goes
  through the token gate." It does not: GET `/links` is registered without `guard()` (`server.js:12`),
  only POST/DELETE are wrapped (`server.js:14–15`). The trust boundary is readable off three lines.
- **A ghost with a real implementation.** `rate-limit` is the sharp one: `config.rateLimit.enabled` is
  `true` and `ratelimit.js` is a working limiter — but nothing on the running path mounts either, so the
  API is not throttled. The name (and the config flag) promise a behavior the running server never runs.
- **A leftover that shares a name.** `legacy-server.js` boots its own server and serves `/links`, but
  `package.json` `main` is `server.js` and nothing requires it. Same word ("server"), opposite danger:
  the leftover is inert, the ghost is a tripwire.

## Verification (what a judge sees)

```bash
# 1. every gate bites, from a cold clone (no territory needed):
node verify.mjs --selftest

# 2. this map, internal gates only:
node verify.mjs --map receipts/linkstash

# 3. this map, FULL — citations + live-wiring against the shipped real tree:
node verify.mjs --map receipts/linkstash --territory receipts/linkstash/territory
```

All three are green. The territory is real Node — `node territory/server.js` boots it if you want to
poke the API — but the checker needs nothing but Node itself.

## Off the map on purpose

`links.js` (the three handlers) is the edge that leads off the mapped spine — it is named on `store`'s
Hits line but not carded, because a reader changing "how a link gets saved" holds the store and the
routes first. `links.json` is data, not a noun. `README.md` is the territory's own door.
