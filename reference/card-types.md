# reference — the closed set of card types

A map produced by this cartographer contains only these kinds of files. Nothing else goes in a
map. This is the closed set.

## 1. The catalog — `catalog.md`

Exactly one per map. The front door. A table of every noun with its state, a one-line
description, and a pointer to its card, plus the collisions list. It **points**; it stores almost
nothing. It is the only file loaded up front. Format is in `rules.md` § "The catalog format".

## 2. The noun card — `objects/<slug>.md`

One per noun. Four kinds, distinguished by the `state:` field, not by shape — the shape is always
the same (`rules.md` § "The card format"):

| card | `state:` | what it means | how it is verified |
|---|---|---|---|
| **live noun** | `live` | wired and in force now | the wiring is cited (a require / mount / call) — `verify.mjs` G9 rejects a `live` card that cites only a comment / blank / TODO |
| **leftover noun** | `leftover` | real work, no longer wired | shown to be referenced by no live path |
| **ghost noun** | `ghost` | a name with no / stale wiring — a tripwire | the missing or stale wiring is named |

A ghost and a leftover look identical in shape; the difference is danger. A leftover is inert
(nothing points at it). A ghost is a tripwire (a reader will *trust the name* and be wrong).

## 3. The decline — `decline.md`

Produced **instead of** a catalog when the territory is an archive: nouns that do not move each
other. See `rules.md` § "When to refuse a map". A map and a decline are mutually exclusive — a
territory gets one or the other, never both.

## Not a card type

- A tour (a narrated walk-through). ✗
- An audit (a list of problems). ✗
- A diagnosis (why something failed). ✗
- A spec (what should be built). ✗
- A copy of a source file in prose. ✗

If a file you are about to add to the map is one of these, stop — it is not part of a map.
