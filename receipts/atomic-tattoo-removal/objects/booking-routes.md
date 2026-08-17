---
noun: booking-routes
state: live
catalog: the only /api surface — consultation slots, book-consultation, busy-times
source: server/routes.js:51, server/routes.js:129
hits: calendar-service, crm-attribution
misses: firebase-admin-console
---

## What it is
The one router mounted at `/api`. Three endpoints: `GET /consultation-slots`, `POST /book-consultation`
(`routes.js:51`), and `POST /calendar-busy-times`. The book handler validates the payload, then calls
`calendarService.createConsultationEvent` and *afterward* `crmService.sendBookingAttribution`
(`routes.js:129`), assembling both results into the response.

## Why it is shaped this way
Validation lives here, once, in front of both services, so neither service has to re-check the input.
The order is deliberate: the calendar event is created first because it is the thing the visitor is
promised; the CRM call comes second precisely so it can be treated as best-effort (see its card).

## Hits — change this, these move
- `calendar-service` — the book handler shapes the object passed to `createConsultationEvent`; rename a field here and the calendar call breaks.
- `crm-attribution` — the same handler forwards the booking plus attribution; the response's `crmRecorded` / `bookingId` fields come from that call.

## Does not hit — the wrong neighbour
- `firebase-admin-console` — a reader assumes "the API is where the admin data comes from." No admin data flows through `/api`; there is no admin endpoint here at all. The admin reads Firestore directly. Adding or changing a booking route does not move a single admin screen.
