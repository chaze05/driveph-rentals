# DrivePH Rentals — Public Booking Site + Dashboards — Design Spec

- **Date**: 2026-10-19 · Portfolio demo (fictional brand), PH car-rental market
- **Stack**: Next.js 15 App Router · TypeScript strict · Tailwind CSS · Framer Motion (`LazyMotion`) · local demo data + localStorage · Vercel
- **Routes**: Home, Fleet (`/cars`), Car detail (`/cars/[slug]`), Contact, Login (`/login`),
  Client dashboard (`/dashboard`), Admin dashboard (`/admin`), 404. All responsive.

## Brand & visual

DrivePH Rentals — self-drive and chauffeur car rental across **Manila, Cebu, Bohol and Siargao**.
Confident automotive look: near-black `#0B0D12`, graphite surface `#14171F`, electric lime
`#D6FF3F` accent, light dashboards `#F5F6F8`. Display **Space Grotesk**, body **Inter**. Cinematic
car photography (Unsplash, local + optimized).

## Functional scope

### Public
- **Home**: hero with booking search (pickup location, dates, vehicle type) → `/cars`; featured
  fleet; how-it-works (choose → book → drive); locations strip; CTA.
- **Fleet**: filters (type, location, transmission, seats, budget, dates), sort, responsive grid.
- **Car detail**: gallery, specs, ₱/day, availability state, **booking form**:
  dates, pickup location, extras (insurance, child seat, chauffeur), driver details
  (name, email, phone, license — license only required for self-drive), consent checkbox.
  Live price summary (days × rate + extras + 12% VAT). Validations below. On submit → booking
  reference confirmation.
- **Contact**: validated inquiry form (simulated delivery).

### Dashboards (demo login)
- Demo accounts (shown on the login screen): `client@driveph.ph / demo1234`,
  `admin@driveph.ph / demo1234`. Session persisted in localStorage, logout.
- **Client `/dashboard`** (protected): my bookings (created in this browser + seeded for the demo
  client), status badges, cancel pending/confirmed bookings, totals.
- **Admin `/admin`** (admin only): stats (revenue, active rentals, utilization), bookings board
  with allowed status transitions (pending → confirmed → active → completed, cancel), fleet list.
- Protected routes redirect to `/login?next=…` when signed out; admin redirects clients to
  `/dashboard`.

## Validations (must be enforced + unit tested)

- Pickup date not in the past; return after pickup; maximum 30 rental days.
- Availability: requested range must not overlap a car's blocked ranges.
- Name/email/PH phone; driver’s license required when self-drive (chauffeur bookings exempt);
  consent required.
- Extras: chauffeur +₱1,500/day, insurance +₱800/day, child seat ₱300 flat.
- Price = days × daily rate + extras; 12% VAT; total to 2 decimals. Days = ceil(hours / 24), min 1.
- Inquiry: name/email/phone/subject/message rules; simulated success.
- Login: exact demo credentials only; wrong credentials show inline error.

## Data (typed local)

- 8 cars: Vios, City, Innova, Montero Sport, Hiace, Ranger, Jimny, Urvan — PH locations, seats,
  transmission, ₱/day, image set, blocked-date ranges.
- 5 seeded bookings (mixed statuses, two for the demo client) so dashboards look real.

## Motion (Framer Motion)

`LazyMotion` + `MotionConfig reducedMotion="user"`: hero entrance, reveal system, card hover,
layout animations on fleet filters, page transitions (`template.tsx`), status-change animations,
booking confirmation, mobile nav. Transform/opacity only; reduced-motion safe.

## QA

Build/typecheck; unit tests for pricing, dates, conflicts, license/consent, auth, status
transitions; QA matrix at 1440/1024/768/390/320 on all public routes + login + 404; E2E for fleet
filters, booking validation paths (past date, bad range, blocked range, missing license/consent),
valid booking → dashboard, admin status changes, protected redirects, inquiries, reduced motion;
Lighthouse targets ≥90 mobile / 100 a11y. Deploy to Vercel + portfolio card.

## Phase 2 — automations (planned, not in this build)

- Email confirmations + 24h pickup reminders (Resend templates).
- Status-change notifications and cancellation emails.
- PDF rental agreement generation and attachment.
- Calendar sync (blocked ranges) and deposit payments via PayMongo (GCash/Maya).
- SMS reminders (PH gateways) and admin notification digests.
