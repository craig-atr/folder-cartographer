# folder-cartographer

**Drop this folder into a Claude project, point it at a body of work, and it leaves behind a map
a later reader can wander — a catalog and a set of noun cards — so that reader never has to read
the whole thing.**

The later reader is usually **a model**: a cold Claude session handed a codebase and one task.
Sometimes it is a new developer. Same map, same job — arrive lost, ask one question, open **one**
card, learn what the thing is and *what else moves if you touch it*, and stop.

---

## What you feed it, what comes back

- **Feed it:** a folder someone will *change* — a repo, a vendor portal, a delivery folder, a
  scenario pack. The unit is *a noun that moves other nouns.*
- **Get back:** a `catalog.md` (the front door) + an `objects/` folder of one card per noun. Each
  card says what the noun is, why it is shaped that way, **what else moves if you change it**, and
  **the one neighbour everyone wrongly assumes it touches** — and cites the source `file:line`
  instead of copying it.
- **If the folder is an archive** (files that do not move each other), it produces a `decline.md`
  instead — it refuses to draw roads that aren't there.

## Quickstart (3 steps)

1. Add this folder to a Claude project. Add the **body of work** you want mapped as well.
2. Say: **"Be the cartographer. Map <the folder>. Follow rules.md."** It inventories the nouns,
   marks each live / leftover / ghost, and writes the catalog + cards.
3. **Walk the map:** open `catalog.md`, pick one noun, open its card, stop. (A human can also
   walk it in the visual viewer — see below.)

## The one rule

**Load the catalog, then one card. Never the whole objects folder.** The catalog points; the
cards live on the shelves; you take the one you came for. Two hops — catalog → card — then stop.
A map that asks you to load everything is just the tree again.

## Verify a map (offline, no API key)

The checker turns every "must" in `rules.md` into a gate. Prove it bites from a cold clone:

```bash
node verify.mjs --selftest
```

Validate a real produced map against the source it cites:

```bash
node verify.mjs --map receipts/vendor-lilly --territory /path/to/vendor-lilly
```

Gates: citations resolve to a real `file:line` · no card photocopies its source · every card has
Hits **and** Does-not-hit · a **`live` noun cites real wiring, not a comment or a TODO** (mapping a
wish as live fails mechanically) · every noun is reachable from the catalog · the loader never says
"load everything" · an archive must decline. Each gate has a fixture in `fixtures/` that fails
without it.

## The visual viewer (optional)

`viewer/index.html` is a thin reader over a produced map — it renders the **same markdown** a
model reads. Two views:

- **Graph** — the map as a walkable graph (the comp's definition of a system map): nouns as
  nodes, colored live / leftover / ghost; **solid edges = "change this, that moves"**, **dashed
  red = the wrong-neighbour** it does *not* move. Click a node to light up its movements; click
  again to open its card. The edges are computed from each card's `hits:` / `misses:` frontmatter
  and **gated by `verify.mjs`** (an edge to a noun that isn't in the catalog fails), so the graph
  can't draw a road that doesn't exist.
- **Cards** — the catalog + one card at a time, with the collisions list.

It is a way to *see* a map, not the map itself (the markdown is canonical). Serve it over http:

```bash
python -m http.server 8231
# then open http://localhost:8231/viewer/?map=../receipts/vendor-lilly
```

## What's in here

| file | one job |
|---|---|
| `identity.md` | who the cartographer is; who the later reader is (a model, said out loud) |
| `rules.md` | how it maps: nouns, movements, live/leftover/ghost, Hits/Does-not-hit, no-photocopy, no-slurp, when to decline |
| `examples.md` | one worked map (Vendor Lilly), walked so you see the rules fire |
| `reference/` | the closed set of card types, the walk order, the naming collisions |
| `verify.mjs` | the offline checker; `--selftest` proves every gate bites |
| `fixtures/` | a tiny self-contained territory + a good map + one negative fixture per gate |
| `receipts/` | real runs: three maps (Vendor Lilly, Atomic Tattoo Removal, Astanza CRM) + an honest archive decline |
| `viewer/` | the visual Map Room (renders a produced map, one card at a time) |

## What it will NOT do

- **It will not tour you through the work.** No start-to-finish narration; you enter at any door.
- **It will not audit or diagnose.** It marks a ghost; it does not scold it or explain a failure.
- **It will not photocopy.** If a card and the file disagree, **the file wins** — the card is a
  pointer, not the truth. It cites; it does not paste.
- **It will not map an archive.** Nouns that don't move each other get a decline, not a fake city.
- **It will not map itself.** The territory is your body of work, not this methodology.

## Worked examples

- [`receipts/vendor-lilly/`](receipts/vendor-lilly/) — a real multi-tenant vendor-portal SaaS
  backend: six cards (five live, one ghost), each cited to source and gated green. Start at its
  [`catalog.md`](receipts/vendor-lilly/catalog.md) and open one card.
- [`receipts/atomic-tattoo-removal/`](receipts/atomic-tattoo-removal/) — a real React + Express
  clinic site whose lesson is that **three backends live in one repo and never touch each other**
  (Express booking, Firestore admin, external CRM): seven cards (six live, one ghost — an admin auth
  gate that is narrower than its name), gated green against the private source.
- [`receipts/astanza-crm/`](receipts/astanza-crm/) — a **big, messy** multi-tenant CRM where most of
  the repo is *not* the app: a 7-noun spine over a junk-drawer root, showing all three states — live
  (server, public external API, two independent auth layers), **leftover** (a superseded
  `server.original.js`, the drawer of one-off scripts), and a **ghost** (an empty index config a
  reader trusts). Gated green against the private source.
