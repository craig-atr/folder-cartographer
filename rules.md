# rules — how the cartographer maps

These are the rules you obey when you map a territory. They are enforced: `verify.mjs` checks
the map you produce against every "must" below, and each check has a fixture that fails without
it. If a rule here has no gate, it is a bug in this folder — say so.

---

## 1. Inventory before cards

You do not write a single card until you can answer, out loud:

1. **What are the nouns?** The things a reader will ask "what is X?" about.
2. **What is dead?** Which names are live, which are leftover, which are ghosts (§4).
3. **What moves what?** Which nouns change other nouns when touched (§5).

If you cannot answer #3 for any pair of nouns, you may be looking at an archive, not a system.
See §8.

## 2. What counts as a noun

A noun is a **thing a reader will need to understand before they change the folder**, and that
**has a home in the source** you can point at. In a codebase: a route, a service, a middleware,
a data collection, a config surface. In a delivery folder: an object, a form, a hand-off doc.

Not a noun: a step in a story ("first we onboard, then we bill"), a feeling about the code, a
best practice. Those are tour narration or opinion. Map things, not plots.

Keep the catalog **small on purpose.** Three real noun cards that cite source beat fifty that
photocopy. If the territory is large, map the **spine** — the few nouns a reader must hold before
touching anything — and say what you left off the map and why.

## 3. What counts as a movement

A movement is: **"if you change A, B changes too."** A shared function, a consumed config, a
route that mounts a middleware, a foreign key, a document another rule reads. Movements are what
separate a map from a glossary. Every card names them (§5).

## 4. Live, leftover, ghost — mark every noun

Every noun in the catalog carries exactly one state:

- **live** — wired and in force. Something reads it or runs it *now*. Verify: find the wiring
  (the `require`/`import`, the mount, the call) and cite it.
- **leftover** — real work that is no longer wired. Honest residue: an old version, a superseded
  file, a pre-refactor copy. Not a tripwire, because nothing points at it. Verify: show it is
  referenced by **no** live path.
- **ghost** — a **name with no (or stale) wiring** that a reader will trust anyway. A documented
  feature with no code; a config field nothing reads; a name still wired into tests or defaults
  but absent from what actually runs. Ghosts are **tripwires** — mark them loudly, because a
  reader who trusts the name implements the wrong world.

**Mapping a wish as live is the cardinal sin.** A plan, a TODO, a "coming soon" is a ghost until
you find the wiring. When unsure, mark it ghost and say what you looked for.

This one is enforced, not just asked: with `--territory`, `verify.mjs` (gate **G9, live-wiring**)
reads the line each `live` card cites and rejects the card if every citation lands on a comment, a
blank line, or a plan/TODO marker instead of real wiring. Ghost and leftover are exempt — a ghost is
*expected* to cite absent or stale wiring. `fixtures/bad-wish-as-live/` is the negative fixture.

## 5. Hits and Does-not-hit — every card names both

Every card ends with two lists:

- **Hits — change this, these move.** The nouns that actually move if the reader changes this one.
  Each with a one-line why, each traceable to source.
- **Does not hit — the wrong neighbour.** Name the **one obvious noun a reader will assume this
  touches, and does not.** This is the line that makes it a map. The word everyone reaches for,
  and why it is the wrong door. A card without this line is a glossary entry, and `verify.mjs`
  rejects it.

## 6. Cite the source; never copy it (no-photocopy)

Each card cites a **`file:line`** (or a few) in the real territory. The card **describes**; it does
not paste. If a reader wants the exact code, the citation sends them to the file. Rules of thumb:

- Quote at most a short identifier or signature, never a block.
- If your card and the file disagree, **the file wins.** The card is a pointer, not a truth.
- `verify.mjs` rejects a card whose text overlaps the cited source beyond a small threshold — a
  photocopy fails mechanically.

## 7. The one rule for the reader (no-slurp)

The map you produce has a **catalog** (`catalog.md`) and a folder of **cards** (`objects/`). The
catalog is the only thing loaded up front. From it, the reader opens **one** card and stops. Your
`README`/output must never instruct the reader to load the whole `objects/` folder or the whole
source. Two hops, then stop: catalog → card → answer.

## 8. When to refuse a map (the decline)

If the inventory finds **nouns but no movements** — files that do not change each other, an
archive, a junk drawer — **do not invent roads.** Produce a `decline.md` that says: what is here,
that the nouns do not move each other, and what a mappable territory would look like instead.
An honest "this is not a system" beats a fake city. `verify.mjs` treats a fabricated map over an
archive as a failure.

---

## The card format (canonical)

Every file in `objects/` is one card, in exactly this shape. `catalog.md`, `examples.md`, the
produced cards, `verify.mjs`, and `viewer/` all agree on it — one canonical schema.

```md
---
noun: <the name a reader searches for>
state: live | leftover | ghost
catalog: <one line for the front door — what it is, in ~10 words>
source: <file:line> [, <file:line> ...]   # must resolve in the mapped territory
hits:   <slug> [, <slug> ...]    # OPTIONAL: catalog nouns this one moves (for the graph)
misses: <slug> [, <slug> ...]    # OPTIONAL: the wrong-neighbour catalog nouns it does NOT move
---

## What it is
<2–4 sentences. Describes, cites source, does not copy it.>

## Why it is shaped this way
<2–3 sentences. The reason for the shape, not a wish for a better one.>

## Hits — change this, these move
- <noun> — <why it moves>
- ...

## Does not hit — the wrong neighbour
- <the one obvious wrong noun> — <why it does NOT move, though everyone reaches for it>
```

## The catalog format (canonical)

```md
# Catalog — <territory name>
> Load this, then ONE card. Never the whole objects/ folder.

| noun | state | what | card |
|---|---|---|---|
| <name> | live | <one line> | objects/<slug>.md |
| ...

## Collisions — read before you walk
- <word> → <meaning A> vs <meaning B>   (see reference/collisions.md)
```

## The walk (what the reader does)

1. Open `catalog.md`. Skim the nouns and the collisions.
2. Pick the one noun the task is about. Open its card.
3. Read what it is, why, and — critically — **what else moves** and **what does not.**
4. Stop. You now know enough to change it without loading the rest.
