import test from "node:test";
import assert from "node:assert/strict";
import { formatPeso } from "../src/lib/format.ts";
import { rentalDays, priceQuote } from "../src/lib/pricing.ts";
import {
  validateBooking,
  validateInquiry,
  validateLogin,
  type BookingDraft,
} from "../src/lib/validation.ts";
import { rangesOverlap, isRangeAvailable } from "../src/lib/availability.ts";
import { findDemoUser } from "../src/lib/auth.ts";
import { canCancel, canTransition, generateRef } from "../src/lib/bookings.ts";

const DAY = 86400000;

test("rental days ceil and minimum one", () => {
  assert.equal(rentalDays("2026-11-01", "2026-11-01"), 1);
  assert.equal(rentalDays("2026-11-01", "2026-11-03"), 3);
  assert.equal(rentalDays("2026-11-01", "2026-11-04"), 4);
});

test("price quote adds extras and 12% VAT", () => {
  const quote = priceQuote({
    dailyRate: 2200,
    days: 3,
    chauffeur: false,
    insurance: true,
    childSeat: true,
  });
  assert.equal(quote.base, 6600);
  assert.equal(quote.extras, 2400 + 300);
  assert.equal(quote.subtotal, 9300);
  assert.equal(quote.vat, 1116);
  assert.equal(quote.total, 10416);
  assert.equal(formatPeso(10416), "₱10,416");
});

test("chauffeur adds a daily fee", () => {
  const quote = priceQuote({
    dailyRate: 3500,
    days: 2,
    chauffeur: true,
    insurance: false,
    childSeat: false,
  });
  assert.equal(quote.extras, 3000);
  assert.equal(quote.subtotal, 10000);
});

test("date range validation", () => {
  const base: BookingDraft = {
    customerName: "Rani Rubillos",
    customerEmail: "rani@example.com",
    customerPhone: "+63 917 555 0142",
    pickupLocation: "Manila",
    pickupDate: "2026-11-01",
    returnDate: "2026-11-04",
    chauffeur: false,
    insurance: true,
    childSeat: false,
    licenseNumber: "N01-23-456789",
    consent: true,
  };

  assert.deepEqual(validateBooking(base, "2026-10-19"), {});

  const past = validateBooking({ ...base, pickupDate: "2026-10-01" }, "2026-10-19");
  assert.ok(past.pickupDate);

  const reversed = validateBooking({ ...base, returnDate: "2026-10-31" }, "2026-10-19");
  assert.ok(reversed.returnDate);

  const tooLong = validateBooking({ ...base, returnDate: "2026-12-01" }, "2026-10-19");
  assert.ok(tooLong.returnDate);

  const noLicense = validateBooking({ ...base, licenseNumber: "" }, "2026-10-19");
  assert.ok(noLicense.licenseNumber);

  const chauffeured = validateBooking(
    { ...base, chauffeur: true, licenseNumber: "" },
    "2026-10-19"
  );
  assert.equal(chauffeured.licenseNumber, undefined);

  const noConsent = validateBooking({ ...base, consent: false }, "2026-10-19");
  assert.ok(noConsent.consent);
});

test("availability overlap detection", () => {
  assert.equal(rangesOverlap("2026-11-01", "2026-11-04", "2026-11-03", "2026-11-06"), true);
  assert.equal(rangesOverlap("2026-11-01", "2026-11-04", "2026-11-04", "2026-11-06"), false);
  const blocked = [{ from: "2026-11-01", to: "2026-11-05" }];
  assert.equal(isRangeAvailable(blocked, "2026-11-03", "2026-11-07"), false);
  assert.equal(isRangeAvailable(blocked, "2026-11-06", "2026-11-08"), true);
});

test("inquiry validation", () => {
  const bad = validateInquiry({
    name: " ",
    email: "x",
    phone: "abc",
    subject: "",
    message: "hi",
  });
  assert.ok(bad.name && bad.email && bad.phone && bad.subject && bad.message);
});

test("demo login only accepts the demo credentials", () => {
  assert.equal(validateLogin("client@driveph.ph", "demo1234"), undefined);
  assert.ok(validateLogin("client@driveph.ph", "wrong"));
  assert.ok(validateLogin("nobody@driveph.ph", "demo1234"));
  assert.equal(findDemoUser("CLIENT@driveph.ph", "demo1234")?.role, "client");
  assert.equal(findDemoUser("admin@driveph.ph", "demo1234")?.role, "admin");
});

test("booking status transitions", () => {
  assert.equal(canTransition("pending", "confirmed"), true);
  assert.equal(canTransition("pending", "completed"), false);
  assert.equal(canTransition("confirmed", "active"), true);
  assert.equal(canTransition("active", "completed"), true);
  assert.equal(canTransition("completed", "pending"), false);
  assert.equal(canCancel("pending"), true);
  assert.equal(canCancel("confirmed"), true);
  assert.equal(canCancel("active"), false);
});

test("booking references look right", () => {
  assert.match(generateRef(), /^DP-[A-Z0-9]{6}$/);
});
