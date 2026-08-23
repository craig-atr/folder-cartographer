---
noun: action-handler
state: live
catalog: the terminal step — calls the user's action with coerced args
source: lib/command.js:557, lib/command.js:571
hits: command
misses: parse-options
---

## What it is
`action(fn)` (`command.js:557`) wraps the user's callback in a listener that slices `processedArgs` to the
declared arity, appends `this.opts()` and the command itself, and stores it as `this._actionHandler`
(`command.js:571`). `_parseCommand` invokes that stored handler as the terminal step of a successful parse
(`command.js:1616`), inside the pre/post-action hook chain.

## Why it is shaped this way
The wrapper is built at registration so it can capture the declared argument count and append options and
the command in the historically fixed order, sparing the user from managing argument positions. Storing one
`_actionHandler` per command keeps the terminal call uniform across the tree.

## Hits — change this, these move
- `command` — the handler is closed over the instance: it reads `this.processedArgs`, `this.opts()`, and the arity from `registeredArguments`. Change the action wrapper and what it pulls off the command moves.

## Does not hit — the wrong neighbour
- `parse-options` — a reader assumes the action can influence how flags are parsed. It cannot: by the time
  the handler runs, tokenizing is long done and `processedArgs` is the sole input. Changing the action
  never reaches back into `parse-options`.
