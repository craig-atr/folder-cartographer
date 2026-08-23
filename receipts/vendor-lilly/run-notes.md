# Run notes — Vendor Lilly

**Territory:** `vendor-lilly` — a multi-tenant vendor-portal SaaS (React + Express + Firebase),
owned by the author. Customer data lives in per-tenant Firestore, not in the repo.
**Later reader:** a cold model (or a new developer) handed the backend and one change to make.
**Run:** the cartographer folder was pointed at the repo; this map is what it left behind.

## What is on the map, and what is not

Mapped the **backend request spine** — the six nouns a reader must hold before changing how a
tenant's data flows. Deliberately **off** the map (and why):

- The **frontend** beyond the two-app collision — a reader changing request/auth flow does not
  need the component tree first; it is its own future map.
- The **internals** of `catalogService`, `inventoryService`, `emailService`, `squareService` —
  named as movements where they matter, but a reader touching the spine does not open them yet.
- The **tests** — evidence about the code, not part of the map (kept separate on purpose).

This is the "map the spine, say what you left off" rule from `rules.md` §2 — three-to-six real
cards that cite source beat a fake city.

## Verification

Every card's `source:` cites a real `file:line` in `vendor-lilly`. Run the checker against a
clone of the territory:

```bash
node verify.mjs --map receipts/vendor-lilly --territory /path/to/vendor-lilly
```

Expected: all gates green — citations resolve, no card photocopies its source, every card has
Hits + Does-not-hit, every noun is reachable from the catalog, and the loader never says "load
everything."

## Off this map (and why)

- **Leftovers.** This spine carries one clean ghost (`flock`) and no leftover — nothing on the mapped
  request path is superseded residue. `/debug` is the nearest unclassified route, just off the spine.
- **The Stripe/Square webhook pair** is a second spine, off this map on purpose — a reader changing
  webhooks opens that map, not these five cards.
