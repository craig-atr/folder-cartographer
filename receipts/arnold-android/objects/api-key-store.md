---
noun: api-key-store
state: live
catalog: the ApiKeyStore interface vs the one wired impl, EncryptedApiKeyStore
source: app/src/main/kotlin/com/arnold/coach/ApiKeyStore.kt:12, app/src/main/kotlin/com/arnold/coach/EncryptedApiKeyStore.kt:16
hits: claude-client, main-activity
misses: coach-services
---

## What it is
Where the user's Claude API key lives. `ApiKeyStore` is the interface everything depends on
(`ApiKeyStore.kt:12`) — the client that reads the key and the Settings screen that writes it.
`EncryptedApiKeyStore` is the **single** concrete implementation (`EncryptedApiKeyStore.kt:16`), backed
by Android's encrypted storage, and it is wired exactly once, in `MainActivity`. Grep "ApiKeyStore"
and you mostly land on the interface; the real storage is the encrypted impl.

## Why it is shaped this way
One store is shared by reader (client) and writer (Settings) so that enabling the coach is immediately
visible to the client with no event bus. Depending on the interface keeps the coach and settings code
testable off-device, while the encryption detail stays in the one Android-bound impl.

## Hits — change this, these move
- `claude-client` — reads the key from this store on each call; change the read contract and the client's auth changes.
- `main-activity` — constructs the one `EncryptedApiKeyStore`; swapping the impl is a one-line change there.

## Does not hit — the wrong neighbour
- `coach-services` — a reader assumes storing a key runs, or is read by, the coach. It is not: the Settings screen only reads/writes this store to *enable* the coach (FIT-31); it never calls a coach service, and no coach service reads the key. The key touches the client, and stops there.
