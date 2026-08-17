---
noun: cart
state: live
catalog: a shopper's bag; sums itself via pricing
source: cart.js:999
---

## What it is
A per-shopper bag of line items that sums itself against the pricing module.

## Why it is shaped this way
It stores quantities, never prices, so a price change never has to reach into a stored bag.

## Hits — change this, these move
- the shopper's displayed total — recomputed from live prices on every call.

## Does not hit — the wrong neighbour
- the price table — the bag reads prices; it does not own them.
