---
noun: main-activity
state: live
catalog: the composition root — constructs the repo, key store, and Claude client
source: app/src/main/kotlin/com/arnold/MainActivity.kt:22, app/src/main/kotlin/com/arnold/MainActivity.kt:28
hits: file-repository, claude-client, coach-services
misses: legacy-app
---

## What it is
The Android entry point, and the app's **only** wiring seam. There is no DI framework: `MainActivity`
constructs the concrete implementations by hand — `FileRepository(File(filesDir, "data"))`
(`MainActivity.kt:22`), `EncryptedApiKeyStore(this)`, and `KtorClaudeClient(keyStore)`
(`MainActivity.kt:28`) — and hands those down to the UI. Everything below depends on interfaces; this
is where the interfaces become objects.

## Why it is shaped this way
Hand-wiring in one activity keeps the whole object graph readable in one screen and keeps the domain
and coach tiers free of Android types. Because construction happens only here, "what is the real
storage / the real client / the real key store" is answered by reading this one file, not by hunting a
module graph.

## Hits — change this, these move
- `file-repository`, `claude-client`, `coach-services` — they receive whatever this file constructs; swap an implementation here and every screen and coach feature gets the new one, with no other edit.

## Does not hit — the wrong neighbour
- `legacy-app` — a reader expects the app's startup to touch the old code it replaced (a migration, an import). It does not: `MainActivity` never references `legacy/` or the `LegacyImporter`. Startup wires the new graph only; the legacy app is not on any path from here.
