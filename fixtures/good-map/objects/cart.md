---
noun: cart
state: live
catalog: a shopper's bag; sums itself via pricing
source: cart.js:13
misses: pricing
---

## What it is
A per-shopper bag of line items. When asked for its worth, it walks its own items and asks the
pricing module what each SKU costs right now (cart.js:13).

## Why it is shaped this way
It stores quantities, never prices, so a price change never has to reach into a stored bag.

## Hits — change this, these move
- the shopper's displayed total — it is recomputed from live prices on every call, not stored.

## Does not hit — the wrong neighbour
- the price table — the bag reads prices; it does not own them. Edit pricing for that.
