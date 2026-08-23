# Catalog — Arnold (the Android app's spine, interface vs. impl)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: `fitness-pixel` — an Android/Kotlin AI fitness-coach app ("Arnold"). This map
> is of the **app** — `app/` plus its build and the quarantined `legacy/`. It is **not** of
> `workflows/` or `docs/` — those are the ICM method that *builds* the app, not the app. Mapped: the
> **7 nouns a reader must hold before changing how a user's data flows or how the AI coach runs**,
> including one real **leftover** and one real **ghost**.

| noun | state | what | card |
|---|---|---|---|
| main-activity | live | the composition root — constructs the repo, key store, and Claude client | [objects/main-activity.md](objects/main-activity.md) |
| file-repository | live | on-device storage: plain JSON files under `filesDir`, **no database** | [objects/file-repository.md](objects/file-repository.md) |
| claude-client | live | the on-device Claude Messages client — forced-tool, retry, resample | [objects/claude-client.md](objects/claude-client.md) |
| coach-services | live | the four AI modes (cycle / program / review / weekly), each with a validator | [objects/coach-services.md](objects/coach-services.md) |
| api-key-store | live | the `ApiKeyStore` interface vs the one wired impl, `EncryptedApiKeyStore` | [objects/api-key-store.md](objects/api-key-store.md) |
| legacy-app | **leftover** | the old Node/JS app under `legacy/`, excluded from the Gradle build | [objects/legacy-app.md](objects/legacy-app.md) |
| legacy-importer | **ghost** | a first-launch migrator wired into tests only — nothing calls it in the app | [objects/legacy-importer.md](objects/legacy-importer.md) |

## Collisions — read before you walk (full method in `../../reference/collisions.md`)

- **the method vs the app** → `workflows/` and `docs/` are the ICM workspaces that *build* Arnold;
  they are **not** Arnold. This map is of `app/` (+ its build + `legacy/`). Mapping `workflows/`
  would be mapping the method, not the territory.
- **interface vs impl** → the app depends on interfaces, wired to one impl each **in MainActivity**:
  `Repository` → `FileRepository`, `ClaudeClient` → `KtorClaudeClient`, `ApiKeyStore` →
  `EncryptedApiKeyStore`. Grep an interface name and you mostly find the interface, not the wiring.
- **legacy** → three different things: the `legacy/` folder (the quarantined old Node app, never
  built), `LegacyImporter.kt` (a Kotlin class that reads `legacy/data/`, itself unwired), and
  `legacy/data/` (the user's real history, read-only — the one part that still matters).
- **program** → `coach/program/` (the AI that *generates* a program) vs `domain/model/Program.kt`
  (the data model) vs `ui/screens/program/` (what displays it). Three nouns, one word.
- **coach vs domain** → `coach/` is the AI tier (it calls Claude); `domain/` is pure logic (Day,
  metrics, workout — no AI). "Change the review" could mean either.
