# Run notes — Fastify 5.9.0 (a public territory)

**Territory:** `fastify/fastify`, tag **`v5.9.0`** (commit `2e45a44`). A real, public, large, high-throughput
framework — not owned by me, not staged. A judge clones the tag and the citations resolve against it.
**Later reader:** a cold model, or a developer, opening a big Fastify codebase to change how an instance is
built, how plugins and routes register, and how a request runs — needing the tight spine before the tree.

## Reproduce cold

```bash
git clone --depth 1 --branch v5.9.0 https://github.com/fastify/fastify.git /tmp/fastify
node verify.mjs --map receipts/fastify --territory /tmp/fastify
```

Green means every `file:line` resolves (G3), no card photocopies its source (G4), and each **live** card
cites real wiring (G9). The `fstdep022` ghost is exempt from G9 — a ghost is expected to cite a name whose
blessed wiring has moved.

## Why this territory earns a card in the set

It is the **"big, messy" case for a map** — hundreds of files, where slurping is worst and a spine is most
valuable. The map holds Fastify to six nouns across the four verbs (build an instance, register a plugin,
register a route, run the lifecycle and reply), plus the object that binds route → lifecycle → reply
(`Context`). Filenames are kebab-case (`plugin-override.js`, `handle-request.js`); the collisions list warns
about the ones a grep gets wrong.

## The wrong turns the map stops

- **Encapsulation is downward-only.** A hook or decorator added inside a child plugin does *not* mutate the
  root — `Object.create(old)` in `plugin-override` shadows the parent. Readers assume child registrations
  bubble up; they inherit down.
- **`route` added ≠ plugin mounted.** Route registration runs synchronously, but the plugin that contains it
  is deferred by avvio's boot queue. `register` (a plugin verb, `null` until avvio fills it) and the `route`
  method are different subsystems.
- **`Context` is a snapshot, not a live view.** Decorating the instance *after* a route registers does not
  retro-update that route; the `Context` copied the constructors and hook arrays at build time.

The ghost, `FSTDEP022`, is the honest kind for a mature framework: top-level router option keys that still
work but warn and are scheduled for removal in `fastify@6`. Trust the name, build on it, and a major bump
deletes it.

## Off this map (and why)

The schema controller, serializers (`lib/schemas.js`, `lib/validation.js`), logging (`lib/logger-*.js`), the
content-type parser internals, the 404 path (`lib/four-oh-four.js`), and the full catalogue of hook *kinds*
are off this spine — they hang off the six nouns here rather than defining the request path. A reader working
one of those would take a second map; this one gets them to the seam they need first.
