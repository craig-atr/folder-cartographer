# Run notes — Arnold (fitness-pixel)

**Territory:** `fitness-pixel` — an Android/Kotlin AI fitness-coach app ("Arnold"; `rootProject.name`
is `Arnold`). Gradle + Kotlin + Jetpack Compose, an on-device Claude Messages client, file-based JSON
storage. The repo is **private**; citations resolve against a clone the reader holds (same arrangement
as the other map receipts).
**Later reader:** a cold model, or a new developer, opening an Android codebase they have never seen and
needing to know how a user's data flows and how the AI coach runs before touching either.

## Why this territory earns its place in the set

It is a **different shape** from the other receipts (Android/Kotlin, not web) and it teaches two things
those did not:

- **Interface vs. impl, wired once.** The app depends on `Repository`, `ClaudeClient`, `ApiKeyStore` —
  and each becomes a concrete object in exactly one place, `MainActivity`. A reader who greps an
  interface name never finds the wiring; the map points them at the composition root.
- **A leftover and a ghost that look alike but aren't.** `legacy/` is an honest **leftover** (the old
  Node app, quarantined out of the build). `LegacyImporter` is a **ghost** — fully built and green in
  tests, its KDoc promising first-launch migration, but called by no production path. Same word
  ("legacy"), opposite danger: the folder is inert, the class is a tripwire.

## The hard line: the method is NOT the territory

This repo also holds `workflows/` (the ICM workspaces that *build* the app) and `docs/` (the shared
context layer). Those are **off the map on purpose** — mapping them would be mapping the methodology,
not the body of work. This map is of the **app**: `app/`, its Gradle build, and the `legacy/` it was
ported from. `CLAUDE.md`, `IMPROVEMENTS.md`, `userguide.md`, and the build output (`build/`, `.gradle`)
are off-map too.

## Verification

Every card's `source:` cites a real `file:line`. With a clone of the private repo:

```bash
node verify.mjs --map receipts/arnold-android --territory /path/to/fitness-pixel
```

Gated green on the author's machine against the working tree: citations resolve, no card photocopies
its source, every `live` card cites real wiring (G9), every card has Hits + Does-not-hit, every noun is
reachable from the catalog, and the loader never says "load everything." The leftover and the ghost are
exempt from the live-wiring gate by design — the ghost's citations deliberately point at its KDoc and
its one caller, a **test**.

## Notes for the next run

- The four coach modes (`cycle` / `program` / `review` / `weekly`) could each earn a card if a reader
  is changing one specifically; here they are mapped as one repeating unit.
- `ui/screens/` (Compose screens + ViewModels, one per feature) is a second map worth its own spine.
