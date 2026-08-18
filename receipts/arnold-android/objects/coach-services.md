---
noun: coach-services
state: live
catalog: the four AI modes (cycle / program / review / weekly), each with a validator
source: app/src/main/kotlin/com/arnold/coach/program/ProgramService.kt:39, app/src/main/kotlin/com/arnold/coach/review/ReviewValidator.kt:25
hits: claude-client, file-repository
misses: api-key-store
---

## What it is
The AI coach tier: four modes under `coach/` — `cycle/`, `program/`, `review/`, `weekly/` — that each
repeat one shape: a `Context` (what it reads), a `Prompt` (what it asks), a `Service` (e.g.
`ProgramService`, `ProgramService.kt:39`), and a `Validator` (e.g. `validateReview`,
`ReviewValidator.kt:25`) that checks the model's structured output. A rejected output is resampled by
the client; a passing one is written back through the repository.

## Why it is shaped this way
The four modes share a shape so a reader who understands one understands all four, and so the validator
— not the prompt — is the guarantee: the mode names what a good result must satisfy, and bad results
are re-asked, not trusted. The service holds the orchestration; the validator holds the contract.

## Hits — change this, these move
- `claude-client` — each mode calls the shared client and passes its validator into the resample loop; change a mode's tool schema and the client's call for that mode changes.
- `file-repository` — each mode reads its context and writes its result through the repository.

## Does not hit — the wrong neighbour
- `api-key-store` — a reader assumes the coach services read or hold the API key. They do not: only the client touches the key store. Writing a key in Settings (FIT-31) enables the client but never calls a coach service, and a coach service never reads the key itself.
