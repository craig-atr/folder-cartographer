# Catalog — Express 4.22.2 (the request/routing spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: **expressjs/express**, tag `v4.22.2` — the most-deployed Node web framework. This map is
> the **routing spine**: the nouns a developer must hold before changing how Express dispatches a
> request through middleware and routes. The view engine, the request/response body helpers, and the
> `middleware/` glue are off this map on purpose — see `run-notes.md`. The territory is public: clone
> the tag and the citations resolve (recipe in `run-notes.md`).

| noun | state | what | card |
|---|---|---|---|
| application | live | the `app` object: `use` / verbs / `handle`; owns no route stack | [objects/application.md](objects/application.md) |
| lazyrouter | live | builds the app's single top-level `Router` on first use, cached on `_router` | [objects/lazyrouter.md](objects/lazyrouter.md) |
| router | live | the real dispatch: walks a stack of `Layer`s and matches | [objects/router.md](objects/router.md) |
| route | live | the inner, per-verb dispatch for one matched path | [objects/route.md](objects/route.md) |
| layer | live | the match-and-invoke primitive both stacks are made of | [objects/layer.md](objects/layer.md) |
| removed-middleware | **ghost** | `bodyParser` / `logger` / `session` names still on `express.*`, but the getters throw | [objects/removed-middleware.md](objects/removed-middleware.md) |

## Collisions — read before you walk (method in `../../reference/collisions.md`)

- **router** → the module/factory (`lib/router/index.js:43`) vs the app's single live instance at
  `this._router` (`lib/application.js:146`). One is the class, one is the object.
- **route vs router** → `proto.route` (a *method* that mints a `Route`, `router/index.js:502`) vs `Route`
  the *class* (`router/route.js:43`). `Router` finds a route; `Route` runs its verb handlers.
- **handle** → four homes: `app.handle` (`application.js:165`), `Router` `proto.handle`
  (`router/index.js:136`), `Layer.handle_request` (`router/layer.js:86`), and `layer.handle` the stored
  fn (`router/layer.js:41`).
- **app** → the callable function (`lib/express.js:38`) vs the `application` prototype mixed onto it
  (`lib/express.js:43`). `app.del` (`application.js:529`) is a `depd`-wrapped alias of `app.delete`.
