# Catalog — Atomic Tattoo Removal (the site's request + data spine)

> Load this, then ONE card. Never the whole `objects/` folder.
> Territory: `atomic-tattoo-removal` — a React + Express site for a laser-tattoo-removal clinic.
> Mapped: the **spine a reader must hold before changing how a visitor's data flows** —
> the booking pipeline and the two *other* backends that live in the same repo. The marketing
> pages, the image pipeline, and the seasonal campaign routes are off this map on purpose — see
> `run-notes.md`.

| noun | state | what | card |
|---|---|---|---|
| express-server | live | the Node server: mounts `/api`, serves the built client, prerender-aware | [objects/express-server.md](objects/express-server.md) |
| booking-routes | live | the only `/api` surface: consultation slots + book + busy-times | [objects/booking-routes.md](objects/booking-routes.md) |
| calendar-service | live | Google Calendar via a service-account JWT; slots, busy-times, event create | [objects/calendar-service.md](objects/calendar-service.md) |
| crm-attribution | live | forwards a confirmed booking to the external CRM; the only token holder | [objects/crm-attribution.md](objects/crm-attribution.md) |
| firebase-admin-console | live | the `/admin` dashboard; reads Firestore **from the browser**, not the server | [objects/firebase-admin-console.md](objects/firebase-admin-console.md) |
| seo-prerender | live | snapshots static routes to `dist/<route>/index.html` for crawlers | [objects/seo-prerender.md](objects/seo-prerender.md) |
| admin-auth-gate | **ghost** | the sign-in on `/admin` that a reader assumes wraps the whole `/admin/*` tree | [objects/admin-auth-gate.md](objects/admin-auth-gate.md) |

## Collisions — read before you walk (full method in `../../reference/collisions.md`)

- **backend** → there are **three**, and they do not touch each other: this repo's **Express server**
  (booking only), **Firestore** (admin data, read straight from the browser), and the **external CRM**
  at `tattooremoval-crm.com` (attribution). "The backend" is always ambiguous here.
- **admin** → `/admin` (the auth-gated landing, `Admin.tsx`) vs `/admin/customers`, `/admin/leads`, …
  (sibling routes that render Firestore-reading components directly) vs "the admin API" — there is
  **none**; no server route serves admin.
- **attribution** → the flat `utm_*` params (written into the Google **Calendar** event description)
  vs the full `attribution` object (forwarded to the **CRM**). One word, two destinations.
- **calendar** → `calendarService` (server → Google Calendar API) vs the date-picker UI in
  `Booking.tsx` vs `getCalendarBusyTimes` (a *different* call than `getAvailableSlots`).
- **booking** → the booking API (`server/routes.js`) vs the booking UI (`client/src/pages/Booking.tsx`)
  vs the setup doc (`BOOKING_SYSTEM_SETUP.md`).
