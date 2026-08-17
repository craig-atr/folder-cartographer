---
noun: pricing
state: live
catalog: the source of truth for prices
source: pricing.js:4
hits: cart
---

## What it is
The single place a SKU becomes a number. One lookup function answers "what does this cost?" and
returns zero for anything unknown (pricing.js:4).

## Why it is shaped this way
One source of truth means a price only ever changes in one file; nothing else stores a copy.

## Hits — change this, these move
- every cart total — the bag calls into here on each sum, so a price edit moves all live totals.

## Does not hit — the wrong neighbour
- what is *in* a cart — this sets a SKU's price, not which SKUs a shopper added. Quantities live on the cart.
