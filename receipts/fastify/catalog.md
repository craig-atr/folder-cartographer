# Catalog — Fastify 5.9.0 (the core request/plugin spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: **fastify/fastify**, tag `v5.9.0` — a large, high-throughput Node framework. This map is a
> **tight spine** over a big repo: the six nouns a developer must hold before changing how Fastify builds
> an instance, registers plugins and routes, runs the request lifecycle, and sends a reply. The schema
> controller, the serializers, logging, and the many hook *kinds* are off this map on purpose — see
> `run-notes.md`. The territory is public: clone the tag and the citations resolve.

| noun | state | what | card |
|---|---|---|---|
| fastify-factory | live | the factory: assembles one root instance as Symbol-keyed state | [objects/fastify-factory.md](objects/fastify-factory.md) |
| plugin-override | live | avvio's child-creation hook — the concrete plugin encapsulation | [objects/plugin-override.md](objects/plugin-override.md) |
| route | live | route registration; builds a per-route Context on a shared find-my-way | [objects/route.md](objects/route.md) |
| hooks | live | the per-instance lifecycle-hook store and its runners | [objects/hooks.md](objects/hooks.md) |
| reply | live | wraps the raw response; owns serialization and the send path | [objects/reply.md](objects/reply.md) |
| context | live | the per-route snapshot the hot request path reads | [objects/context.md](objects/context.md) |
| fstdep022 | **ghost** | top-level router option keys that still work but warn and are slated for removal | [objects/fstdep022.md](objects/fstdep022.md) |

## Collisions — read before you walk (method in `../../reference/collisions.md`)

- **fastify** → the factory `function fastify(...)` (`fastify.js:89`) vs the instance object it returns
  (`fastify.js:120`). Same identifier, shadowed inside its own body.
- **register** → the instance's `register` is `null` (`fastify.js:242`), supplied by avvio (async,
  boot-deferred) — a *plugin* verb, not the synchronous `route` method (`fastify.js:206`).
- **decorate** → `decorate` writes to the instance (`fastify.js:261`); `decorateReply` / `decorateRequest`
  write to the `Reply` / `Request` subclasses (`lib/decorate.js:130,137`). One verb, three targets.
- **context / handler** → the `Context` module (`lib/context.js:23`) vs the per-route `context`
  (`lib/route.js:341`); the user's route `handler` vs the framework's internal `handler` in
  `lib/handle-request.js`.
