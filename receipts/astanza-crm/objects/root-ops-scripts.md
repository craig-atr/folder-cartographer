---
noun: root-ops-scripts
state: leftover
catalog: the drawer of one-off test-/debug-/seed-/fix- scripts at the repo root
source: seed-demo-customers.js:1, debug-firestore.js:1
misses: crm-server
---

## What it is
The ~30 loose scripts sitting at the repo root: `test-*.js`, `debug-*.js`, `seed-demo-customers.js`
(`seed-demo-customers.js:1`), `debug-firestore.js` (`debug-firestore.js:1`), `fix-member-uid.js`,
`update-medical-form-flags.js`, `migrate-customer-counts.js`, and friends. Each boots its own Firebase
Admin and runs a single manual job. They are **leftover**: real tools that were run by hand once, not
wired into the server or any scheduler.

## Why it is shaped this way
A live business accretes one-off maintenance scripts — seed a demo tenant, backfill a field, debug a
query — and they get dropped at the root because that is where they were run from. They pile up because
none of them hurt anything sitting there.

## Hits — change this, these move
- Nothing at runtime. These scripts are invoked manually (`node fix-member-uid.js`) and import nothing from the running server, so editing one moves only that one job the next time a human runs it.

## Does not hit — the wrong neighbour
- `crm-server` — a reader skimming the root sees `seed-demo-customers.js` or `test-api-node.js` and assumes they are part of how the server boots or how the API is tested in CI. They are not imported by `server.js` and are not the test suite; they are a manual toolbox. Treating one as live wiring points a change at a file the server never loads.
