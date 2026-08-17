# Credits — built on ideas from prior comps

Take-from is the culture here; credit travels with the idea. Where each is used:

- **"A must in a markdown file is a request; a must in code is a constraint."** — this is why
  `verify.mjs` exists at all. Every "must" in `rules.md` is a gate, not a sentence.
- **A self-tested checker with negative fixtures** — `verify.mjs --selftest` runs a good map plus
  one bad fixture per gate, each failing on its named check, so the gates are proven to bite from
  a cold clone.
- **Put the headline rule in a gate, not in prose** (the Comp #10 letter's push: two rules there
  lived in markdown, not in `check.mjs`). The cardinal sin of this form — *mapping a wish as live* —
  is gate **G9**: with `--territory`, the checker reads the line each `live` card cites and rejects
  it if the wiring is really just a comment or a TODO. `fixtures/bad-wish-as-live/` proves it bites.
- **The load-vs-verify split** — the folder the model reads (`identity`/`rules`/`examples`/
  `reference`) is kept separate from `fixtures/` (the checker's own material). The cartographer
  never sees its test territory.
- **Script computes, model labels** (carried over from the Regression Historian, Comp #10) — the
  model writes the cards; `verify.mjs` mechanically resolves every citation to a real `file:line`
  and rejects photocopies. The model never gets to *assert* a citation is real.
- **The honest decline / calibration case** — `receipts/craig-howard-archive/` shows the tool
  refusing to map an archive, the same calibrated-abstention move that held up in #9 and #10.
- **README as the door** — first screen is drop-in + what-comes-back, a quickstart, a re-run
  command, and an explicit "what it will not do." No architecture philosophy up top.

Thank you to everyone whose work these build on. This community is the reason each entry is
better than the last. 🔥
