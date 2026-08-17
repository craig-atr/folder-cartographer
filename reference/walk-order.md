# reference — the walk order

How a cold reader (a model with no memory, or a new person) walks a map without eating the tree.
This is the order the `README` points them to, and the order the `viewer/` enforces.

## The walk

1. **Load the catalog.** `catalog.md` only. It fits in one screen and one context window. Skim
   the nouns, their states, and the collisions list.
2. **Read the collisions first.** One word often means two things (see `collisions.md`). Knowing
   which "admin" or which "app" you are in saves a wrong hop.
3. **Pick one noun.** The one the task is about. Open its card in `objects/`. **One card.**
4. **Read the card in order:** what it is → why it is shaped that way → Hits (what moves) →
   Does-not-hit (the wrong neighbour).
5. **Stop.** You now know enough to change that noun safely. Do not pre-load the other cards
   "to be safe" — that is the tree again. Come back to the catalog if the task grows.

## Two-hop guarantee

From the catalog, any noun is reachable in **two hops**: catalog → card. The card names its
movements, so the *next* noun you might need is one more hop away, named and stated. A reader
never has to grep the source to find the front door.

## What breaks the walk

- A catalog that is missing a noun that has a card (an orphan card). `verify.mjs` catches this.
- A card that sends you to "see the whole objects folder." That is a slurp, not a hop.
- A card with no Does-not-hit — you learn what it is but not what is safe, so you open three more
  cards to be sure. The missing line is what turns two hops into ten.
