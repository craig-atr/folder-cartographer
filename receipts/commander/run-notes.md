# Run notes — Commander.js 15.0.0 (a public territory)

**Territory:** `tj/commander.js`, tag **`v15.0.0`** (commit `ba6d13d`). A real, public, very widely used
CLI framework — not owned by me, not staged. A judge clones the tag and the citations resolve against it.
**Later reader:** a cold model, or a developer, opening Commander to change how `argv` becomes commands,
options, and arguments before touching the parser.

## Reproduce cold

```bash
git clone --depth 1 --branch v15.0.0 https://github.com/tj/commander.js.git /tmp/commander
node verify.mjs --map receipts/commander --territory /tmp/commander
```

Green means every `file:line` resolves (G3), no card photocopies its source (G4), and each **live** card
cites real wiring, not a comment (G9). The `args-alias` ghost is exempt from G9 — a ghost is expected to
cite a name whose live wiring is gone.

## What the map teaches (and the honest ghost)

The parse spine is a pipeline on the `Command` object: `parse-command` orchestrates, `parse-options`
tokenizes, `dispatch-subcommand` recurses into a child, and `action-handler` fires last with coerced args.
Two wrong turns the map stops: (1) that **`Command` or the parser builds help** — it doesn't, `help` is a
separate render spine triggered only on `--help`/error; (2) that **the parent finishes option parsing before
dispatching to a subcommand** — it doesn't, the child's `parse-options` re-parses the still-unknown tokens.

Commander's code is clean, so there is **no deprecated method** to dress up as a ghost. The honest ghost is a
field: `this._args`, a deprecated alias of `registeredArguments` that **no live path reads** — it stays
correct only by accident (both references share one in-place-mutated array). Marking a wish or a dead alias
as live is the cardinal sin this form guards against; `_args` is the real, small example of it in a
production parser.

## Off this map (and why — bordering nouns)

`Option` and `Argument` (`lib/option.js`, `lib/argument.js`) are the declared value-objects the pipeline
consults; they are passive specs, so they border the spine rather than drive it. `CommanderError` /
`InvalidArgumentError` (`lib/error.js`) are the throw targets, and `suggestSimilar` (`lib/suggestSimilar.js`)
is the "did you mean" helper — live leaves, but outside the six-noun parse spine. The collisions list carries
`option` / `argument` / `args` because those are exactly where a reader guesses wrong on the first hop.
