---
noun: removed-middleware
state: ghost
catalog: bodyParser / logger / session names still on express.*, but the getters throw
source: lib/express.js:89, lib/express.js:114
misses: application
---

## What it is
A list of ~20 names — `bodyParser`, `logger`, `session`, `cookieParser`, `csrf`, `methodOverride`, and
more — that Express 3 bundled and Express 4 removed (`express.js:89`). Each name is still defined as a
property on `exports`, but its getter does one thing: it throws, telling you the middleware now ships
separately (`express.js:114`). The **name is present; the feature is gone.** That is the ghost: a reader
who greps `express.logger` or remembers `express.bodyParser()` finds the name and trusts it.

## Why it is shaped this way
The names were kept deliberately, wired to a throwing getter, so an upgrader gets a clear error instead of
a silent `undefined is not a function`. It is documentation-by-tripwire: the identifier survives only to
explain its own removal.

## Hits — change this, these move
- Nothing. These are not wired to any request path; each getter only throws. Removing or editing an entry changes the *error message*, not any behaviour, because no live code calls them.

## Does not hit — the wrong neighbour
- `application` — a reader assumes these are live Express features the app mounts (`app.use(express.logger())`),
  so they reach for the application to enable one. They cannot: the getter throws before anything mounts.
  The real fix is to `npm install` the standalone package (e.g. `morgan`, `body-parser`) and require it —
  the application never had these built in.
