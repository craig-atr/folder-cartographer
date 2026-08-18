---
noun: legacy-importer
state: ghost
catalog: a first-launch migrator wired into tests only — nothing calls it in the app
source: app/src/main/kotlin/com/arnold/data/LegacyImporter.kt:13, app/src/test/kotlin/com/arnold/data/LegacyImporterTest.kt:91
misses: file-repository
---

## What it is
`LegacyImporter` — a fully written, fully tested Kotlin class meant to run at first launch, seeding
the on-device store from the user's prior history held read-only under `legacy/data/`
(`LegacyImporter.kt:13`), via its `importAll` / `migrateIfEmpty` methods. The **name and the KDoc
promise a startup behavior** — and that is the ghost: the only code that calls it is its test
(`LegacyImporterTest.kt:91`). No production path invokes it.

## Why it is shaped this way
The migration was built and tested ahead of the onboarding flow that would call it (FIT-2), and that
wiring has not landed. So the class sits complete but unreached — green in tests, absent from what runs.
That gap is invisible from the class itself: it looks live because it works.

## Hits — change this, these move
- Nothing in the running app. Editing `LegacyImporter` changes only what its test exercises; no startup path, screen, or service calls it, so a real first launch does not run it.

## Does not hit — the wrong neighbour
- `file-repository` — a reader sees `LegacyImporter` next to `FileRepository` and assumes the repository (or app startup) runs it to seed the store on first launch. It does not: nothing wires it in. A reader who trusts "old history is imported automatically" ships a first-launch experience that starts empty. If you need the migration, you must *add* the call — it is not there today.
