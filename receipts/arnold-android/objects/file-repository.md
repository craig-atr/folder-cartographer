---
noun: file-repository
state: live
catalog: on-device storage — plain JSON files under filesDir, no database
source: app/src/main/kotlin/com/arnold/data/Repository.kt:28, app/src/main/kotlin/com/arnold/data/FileRepository.kt:36
hits: coach-services
misses: legacy-importer
---

## What it is
The persistence tier. `Repository` is the interface the app depends on (`Repository.kt:28`);
`FileRepository` is the one implementation (`FileRepository.kt:36`), storing everything as plain JSON
files in the app's private `filesDir` — days, cycles, weekly rollups, the program, settings. There is
**no SQLite and no Room**; a "row" is a file, and `JsonStore` + `Paths` decide where each one lives.

## Why it is shaped this way
The data is small, per-user, and already JSON-shaped from the coach, so files are simpler than a
database and let the domain layer stay pure (it hands the repository plain models). The interface is
separate so tests and the JVM domain never touch Android file APIs.

## Hits — change this, these move
- `coach-services` — every coach mode reads its context from the repository and writes its result back through it; change the storage shape or the `Paths` layout and each mode's read/write moves with it.

## Does not hit — the wrong neighbour
- `legacy-importer` — a reader assumes the repository seeds itself from the old data by calling `LegacyImporter` on first use. It does not: `FileRepository` never references the importer. An empty store stays empty (the Today screen shows a load-error state) until real data is written — the migration the importer describes is not wired to this repository at all.
