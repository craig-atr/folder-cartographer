# Run notes — Atomic Tattoo Removal

**Territory:** `atomic-tattoo-removal` — the production website for my laser-tattoo-removal clinic
(React + Vite client, Express server, Firebase/Firestore admin). The repo is **private**, so the
citations resolve against a clone the reader holds, not against a public URL (same arrangement as the
`vendor-lilly` receipt). Customer data lives in Firestore and the CRM, never in the repo.
**Later reader:** a cold model, or a new developer, handed this repo and one change to make to how a
visitor's booking or the clinic's data flows.

## What is on the map, and what is not

Mapped the **request + data spine** — the seven nouns a reader must hold before touching how data
moves. The one thing this territory teaches that a single-app repo does not: **three backends live in
one repo and never touch each other** — the Express server (booking), Firestore (admin, read straight
from the browser), and the external CRM (attribution). The map exists mostly to stop a reader from
assuming they are one "backend."

Deliberately **off** the map (and why):

- The **marketing pages** (`tattoo-removal`, `pricing`, `our-process`, …) — a reader changing data
  flow does not need the content pages first; they are leaves, not spine.
- The **image pipeline** (`optimize-images.mjs`, `importImages.ts`, `Img.tsx`) — its own future map.
- The **seasonal campaign routes** (`/black-friday-*`, `/home-show`, `/pvd`, the contests) — these are
  still wired in the router, so they are **live, not leftovers**, but they are dormant most of the year.
  A fuller pass would classify which are safe to retire; this pass left them off rather than mislabel
  a wired route as a leftover.

## Verification

Every card's `source:` cites a real `file:line` in the territory. With a clone of the private repo:

```bash
node verify.mjs --map receipts/atomic-tattoo-removal --territory /path/to/atomic-tattoo-removal
```

Gated green on the author's machine against the working tree: citations resolve, no card photocopies
its source, every `live` card cites real wiring (G9), every card has Hits + Does-not-hit, every noun
is reachable from the catalog, and the loader never says "load everything." Without the territory,
`--map` alone still checks everything except citation resolution and the live-wiring gate.

## Off this map (and why)

- **The `attribution` collision** (flat `utm_*` → Calendar description vs the full object → CRM) is a
  card of its own for a reader changing marketing tracking specifically — off this spine, which maps the
  data-flow path.
- **`GOOGLE_CALENDAR_OWNER_EMAIL`** is read in `calendarService.js` but absent from `.env.example` — a
  likely config ghost, noted but not carded: it is one env var below the spine, not a noun a reader
  holds first.
