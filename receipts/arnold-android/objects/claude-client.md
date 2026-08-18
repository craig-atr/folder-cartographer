---
noun: claude-client
state: live
catalog: the on-device Claude Messages client — forced-tool, retry, resample
source: app/src/main/kotlin/com/arnold/coach/ClaudeClient.kt:34, app/src/main/kotlin/com/arnold/coach/ClaudeClient.kt:76
hits: coach-services, api-key-store
misses: legacy-app
---

## What it is
The one client every coach feature makes its Claude calls through. `ClaudeClient` is the interface
(`ClaudeClient.kt:34`); `KtorClaudeClient` is the impl (`ClaudeClient.kt:76`), owning a single Ktor
`HttpClient` and the shared plumbing: forced-tool structured output, a transport retry loop for
429/5xx, and a separate resample loop that re-calls when the tool payload leaks or a caller's validator
rejects it. It reads the API key from the injected `ApiKeyStore`.

## Why it is shaped this way
The retry-and-resample contract is written once here instead of in each coach mode, because the four
modes previously each duplicated it. Centralizing it means a fix to the leak-guard or the backoff moves
every feature at once, and the modes stay small — just a prompt and a validator.

## Hits — change this, these move
- `coach-services` — all four modes call through this client; change the tool-call contract or the resample rule and every mode's Claude round-trip changes.
- `api-key-store` — the client reads the key on each call; change what it reads and enabling the coach in Settings behaves differently.

## Does not hit — the wrong neighbour
- `legacy-app` — the client's own docs say it "ports" the plumbing the legacy Node coach modules each duplicated, so a reader assumes it depends on `legacy/`. It does not import one line of it: the legacy code was the *reference*, not a dependency. Changing or deleting `legacy/` does not touch this client.
