# Catalog — Commander.js 15.0.0 (the argument-parsing spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: **tj/commander.js**, tag `v15.0.0` — the most-used Node CLI framework. This map is the
> **parse spine**: the nouns a developer must hold before changing how Commander turns `argv` into
> commands, options, and arguments and fires an action. `Option` / `Argument` value-objects, error
> types, and the "did you mean" helper are bordering nouns, off this spine on purpose — see
> `run-notes.md`. The territory is public: clone the tag and the citations resolve.

| noun | state | what | card |
|---|---|---|---|
| command | live | the core stateful actor; holds options/args and drives the parse tree | [objects/command.md](objects/command.md) |
| parse-command | live | the per-Command orchestrator + recursion point | [objects/parse-command.md](objects/parse-command.md) |
| parse-options | live | the left-to-right tokenizer: option vs operand vs unknown | [objects/parse-options.md](objects/parse-options.md) |
| dispatch-subcommand | live | resolves a subcommand by name and re-enters parsing on the child | [objects/dispatch-subcommand.md](objects/dispatch-subcommand.md) |
| action-handler | live | the terminal step: calls the user's action with coerced args | [objects/action-handler.md](objects/action-handler.md) |
| help | live | the render spine — formats help; owns no argv classification | [objects/help.md](objects/help.md) |
| args-alias | **ghost** | `this._args`, a deprecated alias of `registeredArguments` no live code reads | [objects/args-alias.md](objects/args-alias.md) |

## Collisions — read before you walk (method in `../../reference/collisions.md`)

- **command** → the `Command` class (`command.js:14`), any subcommand instance in `this.commands`, the
  root program, and the string `commandName` matched in `_dispatchSubcommand` (`command.js:1365`).
- **option** → the `Option` spec pushed into `this.options` (`command.js:634`) vs the parsed *value* in the
  Command's option store (`getOptionValue`, `command.js:916`) surfaced by `opts()` (`command.js:1914`).
- **argument** → the `Argument` spec in `registeredArguments` vs a raw CLI operand in `this.args` vs the
  coerced `this.processedArgs` handed to the action (`command.js:1616`). One word, three pipeline stages.
- **args** → `this.rawArgs` (untouched input) vs `this.args` (options removed) vs `this.processedArgs`
  (post-coercion). Reaching for `args` where `processedArgs` is meant is the classic parser bug.
