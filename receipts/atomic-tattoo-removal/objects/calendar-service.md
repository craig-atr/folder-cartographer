---
noun: calendar-service
state: live
catalog: Google Calendar via a service-account JWT — slots, busy-times, event create
source: server/calendarService.js:56, server/calendarService.js:362
hits: booking-routes
misses: crm-attribution
---

## What it is
The server's Google Calendar client. It authenticates as a service account with a JWT
(`calendarService.js:56`), then exposes `getAvailableSlots`, `getCalendarBusyTimes`, and
`createConsultationEvent` (`calendarService.js:362`), which writes the consultation onto the business
calendar with the visitor's details and flat `utm_*` params in the event description. A `USE_MOCK_CALENDAR`
env flag swaps in generated slots so the flow runs with no Google credentials.

## Why it is shaped this way
A service-account JWT (not OAuth) is used because there is no human to click a consent screen — the
server acts as the calendar owner unattended. Mock mode exists so a developer, or a cold model, can
exercise booking end-to-end without real Google keys.

## Hits — change this, these move
- `booking-routes` — the book handler reads `result.eventId` / `result.eventLink` straight into its JSON response; change the shape returned here and the route's response changes.

## Does not hit — the wrong neighbour
- `crm-attribution` — everyone assumes the calendar and the CRM are one "booking backend." They are two. The calendar event is created and returned *before* the CRM is ever called, and the CRM's success or failure is never read back into the calendar. Changing this service does not move whether attribution reaches the CRM.
