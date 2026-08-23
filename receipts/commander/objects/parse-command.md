---
noun: parse-command
state: live
catalog: the per-Command orchestrator + recursion point
source: lib/command.js:1562, lib/command.js:1566
hits: parse-options, dispatch-subcommand
misses: help
---

## What it is
`_parseCommand(operands, unknown)` (`command.js:1562`) is the driver for one command node. It runs the
tokenizer, folds in env/implied options, then decides the handoff: a known subcommand, a help command, a
default command, or this command's own action. It concatenates the tokenizer's operands (`command.js:1566`)
and is the point the parse tree recurses through.

## Why it is shaped this way
It is a linear sequence of guard clauses because dispatch precedence is order-sensitive — a known
subcommand must win before "too many arguments" is raised, and a default command only runs if nothing else
claimed the operands. The order of the checks *is* the routing policy.

## Hits — change this, these move
- `parse-options` — it calls the tokenizer (`command.js:1563`) and consumes its `{ operands, unknown }`; change the orchestration and what the tokenizer is asked to do moves.
- `dispatch-subcommand` — when operands name a subcommand, it hands off here; the recursion is this call.

## Does not hit — the wrong neighbour
- `help` — a reader sees `_parseCommand` call `this.help(...)` on error paths and assumes it *builds* the
  help text. It does not: it only triggers the exit; the layout is produced separately by `Help`. "Shows
  help" and "builds help" are different nouns.
