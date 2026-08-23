---
noun: args-alias
state: ghost
catalog: this._args, a deprecated alias of registeredArguments no live code reads
source: lib/command.js:32
misses: command
---

## What it is
`this._args` — set exactly once, at construction, as an alias of the real array `this.registeredArguments`
(`command.js:32`, tagged "deprecated old name"). It is the *obvious* handle a reader reaches for to get "a
command's arguments." But every live path — the `.push` when an argument is added, the arity in `action`,
the validation, the help — reads `registeredArguments`. **No live code reads `_args`.** It is a ghost: a
trusted name with nothing behind it.

## Why it is shaped this way
It survives as a courtesy for code written against the old field name. It stays in sync only because
`registeredArguments` is mutated in place (`.push`), so the two references share one array. That is exactly
what makes it a tripwire: reassign `registeredArguments` rather than mutating it, and `_args` silently
points at the old array while the parser uses the new one.

## Hits — change this, these move
- Nothing. `_args` is read by no live path; editing what it points at changes no parse behaviour, because the parser holds `registeredArguments` directly.

## Does not hit — the wrong neighbour
- `command` — a reader greps `_args`, assumes it is the command's live argument list, and edits it expecting
  the parser to follow. It will not: the `Command`'s live array is `registeredArguments`. `_args` is a
  dangling alias, not the source of truth.
