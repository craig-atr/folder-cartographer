---
noun: cart
state: live
catalog: a shopper's bag; sums itself via pricing
source: cart.js:13
---

## What it is
A per-shopper bag of line items. The whole thing is just this:
`return cart.items.reduce((s, it) => s + priceFor(it.sku) * it.qty, 0);` — copied straight in
instead of pointing at the file.

## Why it is shaped this way
It stores quantities, never prices.

## Hits — change this, these move
- the shopper's displayed total.

## Does not hit — the wrong neighbour
- the price table — the bag reads prices; it does not own them.
