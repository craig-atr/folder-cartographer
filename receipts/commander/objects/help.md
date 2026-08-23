---
noun: help
state: live
catalog: the render spine — formats help; owns no argv classification
source: lib/help.js:13, lib/help.js:444
misses: parse-command
---

## What it is
The `Help` class (`help.js:13`) and its `formatHelp` (`help.js:444`) are the render spine: given a command,
they lay out usage, options, arguments, and subcommands into the help string. A `Command` builds a `Help`
via `createHelp` and delegates to it; `Help` reads the command's specs but classifies no argv itself.

## Why it is shaped this way
Help layout is kept in its own class so it can be subclassed or configured (`configureHelp`) without
touching the parser, and so the parse spine stays free of formatting concerns. It is called only on
`--help` or on error exits, never on the hot parse path.

## Hits — change this, these move
- Nothing in the parse path. Editing `Help` changes rendered output only; no tokenizing, dispatch, or action step reads it, so a normal successful parse runs identically whether or not `Help` changes.

## Does not hit — the wrong neighbour
- `parse-command` — a reader assumes help text is a product of parsing, so they look to `_parseCommand` to
  change what `--help` shows. It is the wrong door: the orchestrator only *triggers* help on `--help` /
  error; the text is built here. Change the parser and the help layout is untouched.
