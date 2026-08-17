---
noun: crm-attribution
state: live
catalog: forwards a confirmed booking to the external CRM — the only token holder
source: server/crmService.js:39, server/crmService.js:50
hits: booking-routes
misses: calendar-service
---

## What it is
The server module that POSTs a confirmed booking plus its marketing attribution to the external CRM
at `tattooremoval-crm.com`. It is the **only** place that reads `EXTERNAL_BOOKING_TOKEN`
(`crmService.js:50`); the browser never sees it. `sendBookingAttribution` (`crmService.js:39`) is
written never to throw — a missing token, a bad status, or an unreachable host all return a
`{ recorded: false }` result instead of raising.

## Why it is shaped this way
The token stays server-only so a shared secret is never shipped to the browser. The never-throw
contract is deliberate: by the time this runs, the calendar event already exists and the visitor is
already booked, so losing attribution must never turn into losing the booking.

## Hits — change this, these move
- `booking-routes` — the book handler reads this call's result into the response `crmRecorded` / `bookingId` / `attributionSource` fields; change the returned shape and the route's response changes.

## Does not hit — the wrong neighbour
- `calendar-service` — a reader assumes "if the CRM call changes, booking changes." It cannot. This runs *after* the calendar event is committed and is fully best-effort; the calendar event, and the success the visitor sees, are already decided. Changing or breaking this does not move the booking itself.
