---
noun: store
state: live
catalog: the only code that reads/writes the JSON file on disk
source: store.js:13, store.js:20
misses: rate-limit
---

## What it is
The persistence layer: `readAll()` parses the JSON file into an array (`store.js:13`) and `writeAll()`
serializes an array back to it (`store.js:20`). The file path comes from `config.storeFile`. Every
handler that lists, creates, or removes a link goes through these two functions — nothing else opens
the file.

## Why it is shaped this way
A flat JSON file and two functions, chosen so the whole data model is one array on disk with no schema
or migration. `readAll()` swallows a parse error into `[]` so a missing or empty file reads as "no
links yet" instead of crashing the first request.

## Hits — change this, these move
- The three handlers in `links.js` (`list` / `create` / `remove`) — they are the only callers; change the on-disk shape (an object instead of an array, a new field) and each of them must change to match. (`links.js` is off the mapped spine — this is the edge that leads off the map.)

## Does not hit — the wrong neighbour
- `rate-limit` — because both feel like "protecting writes," a reader assumes throttling lives near
  persistence. It does not: `store.js` writes every call it is given, with no counter or limit. The
  limiter is a separate file that nothing mounts — and it is a ghost. Change the store and no throttle
  appears; the writes were never limited to begin with.
