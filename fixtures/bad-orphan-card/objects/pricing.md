---
noun: pricing
state: live
catalog: the source of truth for prices
source: pricing.js:5
misses: cart
---

## What it is
The price table every cart consults. This card exists on disk but the catalog does not list it —
so a reader walking from the catalog can never reach it. That orphan is what gate G5 catches.

## Why it is shaped this way
It is a deliberately unreachable card: a real file in `objects/` with no row in `catalog.md`.

## Hits — change this, these move
- every cart's displayed total, since carts read prices from here.

## Does not hit — the wrong neighbour
- the cart's stored quantities — pricing never writes into a bag; it only answers "what does this cost".
