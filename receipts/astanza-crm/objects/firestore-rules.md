---
noun: firestore-rules
state: live
catalog: the database-layer tenant isolation — a separate guard from the middleware
source: firestore.rules:14, firestore.rules:9
hits: 
misses: tenant-auth
---

## What it is
The security rules Firestore itself enforces on every read and write, no matter who is calling. The
core is `isTenantMember(tenantId)` (`firestore.rules:14`), which allows access only to an approved user
inside that tenant's `users` subcollection, plus a hardcoded super-admin email escape hatch
(`firestore.rules:9`). This is the guard that holds even when the Express server is bypassed entirely.

## Why it is shaped this way
The CRM's data is reached two ways — through this server's `/api` routes and, for some dashboards,
straight from the browser's Firebase client. Only a rule enforced *by the database* covers both paths,
so tenant isolation is written here rather than trusted to the API alone.

## Hits — change this, these move
- Every path to the data at once — because these rules are enforced by Firestore, not by any file in this repo, a change here moves what the API *and* any direct-Firestore client can see, with nothing in the codebase importing it to signal the ripple.

## Does not hit — the wrong neighbour
- `tenant-auth` — a reader assumes "isolation is the middleware; the rules just mirror it." They are two independent guards that can disagree. The middleware can allow a request that the rules then deny, or vice versa. Loosening the Express middleware does not loosen these rules, and a gap here is not visible anywhere in `middleware/auth.js`.
