---
noun: legacy-app
state: leftover
catalog: the old Node/JS app under legacy/, excluded from the Gradle build
source: settings.gradle.kts:25, legacy/package.json:2
hits:
misses: main-activity
---

## What it is
The previous version of the product: a Node/JS app (`legacy/package.json` names it `fitness-coach`,
`legacy/package.json:2`) that the Android app was ported from. It is **leftover**, and deliberately so:
`settings.gradle.kts` includes only `:app` (`settings.gradle.kts:25`) and a comment right above states
`legacy/` is intentionally not part of the build. It never compiles, never ships, and nothing in the
Kotlin source imports it.

## Why it is shaped this way
The port kept the old app on disk as a reference — its behavior, its prompts, its data — rather than
deleting it. The quarantine is enforced by leaving it out of the Gradle settings, so keeping it around
costs nothing at build or run time.

## Hits — change this, these move
- Nothing in the shipping app. Editing or deleting `legacy/` changes no compiled code — that is the test that confirms it is leftover, not live. (The only thing that still *reads* `legacy/data/` is the read-only user history, via the unwired `legacy-importer`.)

## Does not hit — the wrong neighbour
- `main-activity` — a reader looking for "the app" greps and opens `legacy/` because it is full of real, working code. It is the wrong door: the running app is `app/`, wired from `MainActivity`. Changes in `legacy/` never reach the build, so trusting it describes a product that no longer runs.
