# Run notes — Astanza CRM

**Territory:** `astanza-crm` — the multi-tenant CRM behind my tattoo-removal clinics (Express +
Firebase/Firestore, deployed on Cloud Run). The repo is **private**; citations resolve against a clone
the reader holds, not a public URL (same arrangement as the other two map receipts).
**Later reader:** a cold model, or a new developer, dropped into a big, messy repo and told to change
how a clinic's data flows — who needs to know what runs, what is dead weight, and what lies.

## Why this territory is the sharpest test of the form

Most of this repo is **not** the app. The root holds ~30 one-off scripts and a dozen design docs; the
real server is seven files deep under `server/`. A cold reader who "reads the folder top to bottom"
drowns. The whole point of the map is: a tiny catalog (7 nouns) lets them enter, and the **live /
leftover / ghost** marks stop them from trusting a fossil (`server.original.js`), a manual script
(`seed-demo-customers.js`), or an empty config (`firestore.indexes.json`) as if it were wiring.

It also shows the **three-independent-guards** shape: the Express middleware, the Firestore rules, and
storage rules each isolate tenants separately — the single most common wrong assumption a new developer
brings to this codebase ("auth is in one place").

## What is on the map, and what is not

Mapped the **request + isolation spine**: the server, the public external API other sites call into,
the two independent auth layers, and the three loose files that are *not* what they look like.
Deliberately **off** the map (and why):

- The **feature routes** — `stripe`, `tiktok` / `tiktokApi`, `sms` / `twilio`, `images`, `email`,
  `intake`, `medicalForm`, and the **trend-radar** AI subsystem (`routes/trendRadar.js` +
  `services/aiContentService.js`, OpenAI). Each is real and live, but a reader changing data-flow does
  not need them first; several deserve their own future map (trend-radar especially).
- **All patient data** — `server/uploads/`, `server/offline-submissions/`, `server/cache/medical-pdfs`,
  and `.env`. Real PII and secrets; a cartographer names its exclusions and never copies them into a card.
- The **design docs** (`*_API.md`, `MEDICAL_FORM_SYSTEM.md`, `TwilioReminder.md`, `ToDo.md`) — these
  describe intent; the map cites the code that runs. Some are candidate ghosts to confirm next pass.

## Verification

Every card's `source:` cites a real `file:line`. With a clone of the private repo:

```bash
node verify.mjs --map receipts/astanza-crm --territory /path/to/astanza-crm/astanza-crm
```

Gated green on the author's machine against the working tree: citations resolve, no card photocopies
its source, every `live` card cites real wiring (G9), every card has Hits + Does-not-hit, every noun is
reachable from the catalog, and the loader never says "load everything." The two leftovers and the
ghost are exempt from the live-wiring gate by design.

## Notes for the next run

- Confirm whether `telegram-bot.js` (required at `server/server.js:310`) is live in production or dark
  behind an unset token — it is wired but may be a conditional ghost.
- `TwilioReminder.md` describes scheduled reminders; confirm a scheduler actually runs them, or the
  reminder feature is a doc-ghost.
