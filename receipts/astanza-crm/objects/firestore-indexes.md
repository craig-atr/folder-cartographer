---
noun: firestore-indexes
state: ghost
catalog: an empty index config a reader trusts as the source of truth for indexes
source: firestore.indexes.json:2
misses: firestore-rules
---

## What it is
`firestore.indexes.json` — a config whose `indexes` and `fieldOverrides` arrays are both **empty**
(`firestore.indexes.json:2`). The **name** promises "the composite indexes this app needs are defined
here." That promise is a ghost: the file declares none. Any composite index the CRM's queries actually
rely on was created in the Firebase console (Firestore prompts for it on the first failing query) and
is **not** reflected in this file.

## Why it is shaped this way
`firebase init` scaffolds this file empty, and indexes then get created ad hoc from the console error
links during development rather than being written back here. The file stays empty because nothing
forces it to match reality — an empty index file and a fully-indexed database look identical from the
repo.

## Hits — change this, these move
- Nothing, on its own. Adding an entry here does nothing until it is deployed, and the queries that depend on indexes work today because the indexes already exist in the console — not because of this file.

## Does not hit — the wrong neighbour
- `firestore-rules` — both are `firestore.*` config a reader treats as one deploy surface, so they assume this file is as load-bearing as the rules. It is not: `firestore.rules` is enforced live on every request, while this file is an empty, out-of-sync mirror. A reader who adds a query, hits a "needs an index" error, and edits *this file* expecting the fix to take will wait for a deploy that changes nothing — the index has to be created in the console.
