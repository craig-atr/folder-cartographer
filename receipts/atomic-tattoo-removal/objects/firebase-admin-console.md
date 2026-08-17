---
noun: firebase-admin-console
state: live
catalog: the /admin dashboard — reads Firestore from the browser, not the server
source: client/src/firebaseConfig.ts:19, client/src/pages/admin/Customers.tsx:80
hits: admin-auth-gate
misses: express-server
---

## What it is
The internal `/admin` dashboard — customers, leads, sales, ad-spend, and the reports under
`/admin/reports/*`. Every one of these screens imports the Firestore handle `db` from
`firebaseConfig.ts` (`firebaseConfig.ts:19`) and reads and writes Firestore **directly from the
browser** (e.g. `getDocs(collection(db, 'customers'))`, `Customers.tsx:80`). It is a second,
independent app that happens to be routed inside the same SPA as the marketing site.

## Why it is shaped this way
The clinic's operational data (customers, sales, ad cost) lives in Firestore, and the admin talks to
it client-side so the Express server never has to grow a data API. That is why the server and this
console share a repo but not a request path.

## Hits — change this, these move
- `admin-auth-gate` — the console's front door is the sign-in in `Admin.tsx`; the reports and list screens all assume a signed-in Firebase user is present (read that card — the gate is narrower than it looks).

## Does not hit — the wrong neighbour
- `express-server` — the word everyone reaches for is "the backend serves this." It does not. Not one admin screen calls `/api`; the data comes from Firestore over the browser's own connection. You can change, restart, or break the Express server and every admin screen keeps loading its data. (The Firestore security rules that actually guard that data live in the Firebase project, **outside this repo** — they are not on this map.)
