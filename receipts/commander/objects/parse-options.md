---
noun: parse-options
state: live
catalog: the left-to-right tokenizer — option vs operand vs unknown
source: lib/command.js:1760, lib/command.js:1563
hits: parse-command
misses: action-handler
---

## What it is
`parseOptions(args)` (`command.js:1760`) is the single scanner that walks the raw arg array left to right
and classifies each token: an option (consuming its value), a positional operand, or an unknown flag. It
honours `--`, combined short flags (`-abc`), and negative-number detection, and returns
`{ operands, unknown }` to its caller (`command.js:1563`).

## Why it is shaped this way
It is one imperative `while` loop with a cursor because option parsing is inherently stateful — a flag can
pull the next token, and a short-flag group must be re-fed a character at a time. A declarative pass cannot
express "this flag eats the following argument" cleanly, so the loop carries the state.

## Hits — change this, these move
- `parse-command` — it is the direct caller and consumes the returned `operands` / `unknown`; change what the tokenizer classifies or returns and the orchestrator's next decisions move with it.

## Does not hit — the wrong neighbour
- `action-handler` — a reader assumes tokenizing and running the action are one pass, so changing option
  parsing must change what the action sees. It does not directly: the action reads `this.processedArgs`,
  produced later by `_processArguments`. The action never re-reads raw argv, so the tokenizer reaches it
  only through that intermediate, not by touching it.
