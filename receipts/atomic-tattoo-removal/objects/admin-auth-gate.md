---
noun: admin-auth-gate
state: ghost
catalog: the sign-in on /admin a reader assumes wraps the whole /admin/* tree
source: client/src/pages/Admin.tsx:20, client/src/App.tsx:220
misses: firebase-admin-console
---

## What it is
The Google sign-in on the `/admin` landing page. `Admin.tsx` subscribes to `onAuthStateChanged`
(`Admin.tsx:20`) and shows "Access denied" until a user signs in. The **name** a reader carries away
is "the admin section is gated." That name is a ghost: the gate is wired into `Admin.tsx` only. In the
router, `/admin/customers`, `/admin/leads`, `/admin/sales`, and the reports are **sibling** routes
(`App.tsx:220` onward), not children of `/admin` — each renders its own component, and those
components import the Firestore handle `db` but not `auth`. The wall a reader pictures around the whole
tree is not wired where they think it is.

## Why it is shaped this way
The dashboard grew one screen at a time, each added as its own top-level `/admin/...` route rather than
nested under a single guarded parent. The sign-in on the landing page stayed where it started. Nobody
moved it because the landing page still gates as expected — which is exactly what makes it a ghost:
the visible page behaves, so the name feels true.

## Hits — change this, these move
- Nothing downstream at runtime. Editing the sign-in logic in `Admin.tsx` changes the `/admin` landing and nothing else — that is the test that this is a ghost, not a shared gate.

## Does not hit — the wrong neighbour
- `firebase-admin-console` — a reader assumes "the auth gate protects the admin screens," so changing it should move them. It does not: the sub-route components never pass through `Admin.tsx`. Whether those screens' *data* is actually protected is decided by Firestore security rules in the Firebase project — **outside this repo, off this map**. The map's only claim is where the client-side gate is wired, and where it is not.
