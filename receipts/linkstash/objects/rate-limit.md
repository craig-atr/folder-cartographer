---
noun: rate-limit
state: ghost
catalog: config says enabled true, but nothing on the running path reads it
source: config.js:14, ratelimit.js:8
misses: server
---

## What it is
Two real artifacts with a promise between them and no wire connecting them. `config.rateLimit` is set
to `{ enabled: true, ... }` (`config.js:14`), and `ratelimit.js` exports a working token-bucket
`createLimiter()` (`ratelimit.js:8`). The ghost is the gap: **no file on the running path imports
`ratelimit.js` or reads `config.rateLimit`.** A reader who sees `enabled: true` and trusts the API is
throttled is trusting a switch wired to nothing.

## Why it is shaped this way
The limiter was written and the config flag added before the wiring in `server.js` landed — and it
never did. `server.js` even names it in a comment as deliberately not mounted (`server.js:17–18`). So
the flag and the implementation both exist and look live, while the running server enforces no limit.

## Hits — change this, these move
- Nothing on the running path. Flip `enabled` to `false`, raise `max`, or edit `createLimiter()` and a live request behaves identically — no code reads either one. To make it real you must *add* the mount in `server.js`; it is not there today.

## Does not hit — the wrong neighbour
- `server` — the reader assumes `server.js` mounts the limiter (that is where middleware would go), so
  editing the config must change server behaviour. It does not: the only mention of rate limiting in
  `server.js` is the comment saying it is *not* wired. The server never calls the limiter.
