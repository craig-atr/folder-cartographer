---
noun: dispatch-subcommand
state: live
catalog: resolves a subcommand by name and re-enters parsing on the child
source: lib/command.js:1364, lib/command.js:1379
hits: parse-command
misses: parse-options
---

## What it is
`_dispatchSubcommand(commandName, operands, unknown)` (`command.js:1364`) resolves a subcommand by name
and either re-enters parsing on that child (`subCommand._parseCommand(...)`, `command.js:1379`) or, for
git-style executable subcommands, shells out to a separate process. It threads the `preSubcommand` hook
chain around the handoff.

## Why it is shaped this way
It returns a promise chain so the sync path and `parseAsync` share one implementation, and it forks on the
executable case because external subcommands run as their own process rather than in-tree. The name-to-child
resolution is what turns `git commit`-style CLIs into a recursion.

## Hits — change this, these move
- `parse-command` — the handoff *is* a call to the child's `_parseCommand`; change how dispatch resolves or what it forwards and the child's whole parse re-run moves.

## Does not hit — the wrong neighbour
- `parse-options` — a reader assumes the parent finishes option parsing before dispatching, so unknown
  flags are already resolved. It is the opposite: dispatch forwards the still-`unknown` tokens to the
  child, whose own `parse-options` re-parses them. The parent deliberately does *not* finalize unknown
  options before the handoff.
