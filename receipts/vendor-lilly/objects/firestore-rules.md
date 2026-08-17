---
noun: firestore.rules
state: live
catalog: tenant isolation; keeps Square creds off the client
source: firestore.rules:41, firestore.rules:36
hits: public-route
---

## What it is
The Firestore security rules that isolate one tenant's data from another and keep secrets off the
client. The `/tenants/{tenantId}` document is writable only by a platform admin and is **not**
client-readable (`firestore.rules:41,44`), because it holds Square credentials
(`firestore.rules:36`). Sub-collections (users, vendors, requests) are gated by per-tenant role
helpers — `isTenantAdmin`, `isTenantVendor`, `isPlatformAdmin`.

## Why it is shaped this way
The database is the enforcement boundary, not the UI. A vendor in tenant A must not read tenant
B's anything, and no browser must ever see a Square access token — so the rules deny the tenant
doc to clients outright and force config to flow through the backend instead.

## Hits — change this, these move
- The frontend's access to tenant data — loosen or tighten a role helper and every screen that reads that collection changes behavior.
- `/public/tenant/:slug` — because the client cannot read the tenant doc directly, this backend endpoint is the sanctioned path; the rules and that route are two halves of one decision.

## Does not hit — the wrong neighbour
- The frontend reading the tenant document directly. Everyone reaches for "the app fetches `/tenants/{id}` and reads the config." It **cannot** — the rules block client reads of that doc (`firestore.rules:41`). The config arrives via `GET /public/tenant/:slug`, credentials stripped. Editing the rules will not "let the frontend read the tenant doc" unless you also intend to leak Square creds.
