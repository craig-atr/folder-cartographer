# Run notes — Express 4.22.2 (a public territory)

**Territory:** `expressjs/express`, tag **`v4.22.2`** (commit `df0abc9`). A real, public, widely-deployed
Node web framework — not something I own, and not staged. A judge clones the same tag and every citation
in this map resolves against their own checkout.
**Later reader:** a cold model, or a developer, opening Express's `lib/` to change how a request is routed
and needing to know where dispatch actually happens before touching it.

## Why this receipt exists

It complements `linkstash` (which ships its territory in-repo). This one points at a **public** codebase a
judge already trusts: clone the tag, run the checker, watch the citation gate (G3) and the live-wiring gate
(G9) go green against real, third-party source. It is the Comp #10 "point it at a public repo" move applied
to a map.

## Reproduce cold

```bash
git clone --depth 1 --branch v4.22.2 https://github.com/expressjs/express.git /tmp/express
node verify.mjs --map receipts/express --territory /tmp/express
```

Green means: every `file:line` resolves (G3), no card photocopies its source (G4), and each **live** card
cites a real line of wiring, not a comment or a TODO (G9). The `removed-middleware` ghost is exempt from
G9 by design — a ghost is *expected* to cite a name whose wiring is gone.

## What the map teaches (the one wrong turn it stops)

The spine's payoff is a single correction: **the `application` (`app`) does not route.** `app.use` and
`app.get` don't store handlers on the app — they call `lazyrouter()` and forward into a single `Router`
built lazily on `this._router`. Dispatch is a two-level walk (`Router#handle` finds the matching `Layer`;
`Route#dispatch` runs the matched path's verb handlers), and path-matching lives on `Layer`, not on any of
them. A reader who "fixes routing" in `application.js` is usually in the wrong file; the map sends them to
`router/index.js`, `route.js`, or `layer.js` instead.

The ghost is `express.bodyParser` / `express.logger` / `express.session` and friends: names still present on
`express.*` whose getters throw, because the middleware was unbundled in Express 4. A reader who trusts the
name ships an app that crashes on boot.

## Off this map (and why)

The view engine (`lib/view.js`, `app.render`), the `request`/`response` body helpers (`req.body`, `res.json`,
the many `res.*` senders), and the `lib/middleware/` glue (`init`, `query`) are off this spine — they are
what a request *carries*, not how it is *routed*. `app.del` and the `router.param(fn)` deprecations are
real near-ghosts too, noted in the collisions rather than carded, to keep the spine to six nouns.
