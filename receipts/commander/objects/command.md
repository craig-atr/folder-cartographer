---
noun: command
state: live
catalog: the core stateful actor; holds options/args and drives the parse tree
source: lib/command.js:14, lib/command.js:26
hits: parse-command, action-handler
misses: help
---

## What it is
The `Command` class (`command.js:14`), extending `EventEmitter`, is the only stateful actor in parsing.
Each instance owns its declared specs (`this.options`, seeded at `command.js:26`; `registeredArguments`;
`this.commands`) and its parse state (`rawArgs`, `args`, `processedArgs`). Every program and every
subcommand *is* a `Command`, so parsing is a tree walk over these instances, each parsing independently.

## Why it is shaped this way
It keeps all parse state as instance fields so a node in the command tree can parse on its own and even
save/restore state around a re-parse. It extends `EventEmitter` so the legacy `command:*` and option
listeners still fire, kept for back-compat around the modern action path.

## Hits — change this, these move
- `parse-command` — reads and mutates the instance's `args` / `processedArgs`; the orchestrator is driving *this* object's fields.
- `action-handler` — the stored handler is closed over the instance and reads `this.processedArgs` and `this.opts()`; change the state shape and the action's inputs move.

## Does not hit — the wrong neighbour
- `help` — a reader assumes the `Command` formats its own `--help`. It does not: `helpInformation`
  (`command.js:2464`) delegates to a `Help` instance, which owns all layout. Editing `Command` changes
  parse state, not help output.
