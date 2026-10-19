"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import type { Car } from "@/data/cars";
import { SITE } from "@/data/site";
import { formatPeso } from "@/lib/format";
import { priceQuote, rentalDays } from "@/lib/pricing";
import { isRangeAvailable } from "@/lib/availability";
import { validateBooking, type BookingDraft } from "@/lib/validation";
import { generateRef } from "@/lib/bookings";
import { useBookings } from "@/components/providers/BookingsProvider";
import { Field } from "@/components/ui/Field";

function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function CarBookingForm({
  car,
  initialPickup = "",
  initialReturn = "",
}: {
  car: Car;
  initialPickup?: string;
  initialReturn?: string;
}) {
  const { addBooking } = useBookings();
  const today = todayIso();

  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [pickupLocation, setPickupLocation] = useState<string>(car.location);
  const [chauffeur, setChauffeur] = useState(false);
  const [insurance, setInsurance] = useState(true);
  const [childSeat, setChildSeat] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState<{ ref: string; total: number } | null>(null);

  const days = pickupDate && returnDate && returnDate > pickupDate
    ? rentalDays(pickupDate, returnDate)
    : 1;
  const quote = useMemo(
    () => priceQuote({ dailyRate: car.dailyRate, days, chauffeur, insurance, childSeat }),
    [car.dailyRate, days, chauffeur, insurance, childSeat]
  );

  const draft: BookingDraft = {
    customerName,
    customerEmail,
    customerPhone,
    pickupLocation,
    pickupDate,
    returnDate,
    chauffeur,
    insurance,
    childSeat,
    licenseNumber,
    consent,
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateBooking(draft, today);

    if (!nextErrors.pickupDate && !nextErrors.returnDate) {
      if (!isRangeAvailable(car.unavailable, pickupDate, returnDate)) {
        nextErrors.returnDate = "This car is already booked for those dates.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      const booking = {
        ref: generateRef(),
        carSlug: car.slug,
        customerName,
        customerEmail,
        customerPhone,
        pickupLocation,
        pickupDate,
        returnDate,
        chauffeur,
        insurance,
        childSeat,
        subtotal: quote.subtotal,
        vat: quote.vat,
        total: quote.total,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);
      setSending(false);
      setConfirmed({ ref: booking.ref, total: booking.total });
    }, 700);
  };

  if (confirmed) {
    return (
      <div role="status" className="rounded-2xl border border-lime/30 bg-lime/5 p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-lime">
          Booking received
        </p>
        <p className="mt-2 font-display text-2xl font-bold">{confirmed.ref}</p>
        <p className="mt-2 text-sm text-white/70">
          {car.name} · {pickupDate} → {returnDate} · {formatPeso(confirmed.total)}
        </p>
        <p className="mt-3 rounded-xl border border-white/10 bg-night/60 px-3 py-2 text-[11px] text-muted-dark">
          Demo booking — no payment was taken. Sign in to manage or cancel it.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-night transition-colors hover:bg-lime-dark"
          >
            View my bookings
          </Link>
          <Link
            href="/cars"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-lime/60"
          >
            Book another car
          </Link>
        </div>
      </div>
    );
  }

  const checkRow = (
    checked: boolean,
    onChange: (value: boolean) => void,
    label: string,
    hint: string
  ) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line-dark bg-graphite/60 p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-lime"
      />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] text-muted-dark">{hint}</span>
      </span>
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line-dark bg-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-2xl font-bold text-lime">
          {formatPeso(car.dailyRate)}
          <span className="text-xs font-medium text-muted-dark"> / day</span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-dark">
          {car.location}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field
          label="Pickup date"
          name="pickupDate"
          type="date"
          value={pickupDate}
          onChange={setPickupDate}
          error={errors.pickupDate}
          min={today}
          required
        />
        <Field
          label="Return date"
          name="returnDate"
          type="date"
          value={returnDate}
          onChange={setReturnDate}
          error={errors.returnDate}
          min={pickupDate || today}
          required
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
            Pickup city <span className="text-lime">*</span>
          </span>
          <select
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value)}
            className="w-full rounded-xl border border-line-dark bg-graphite px-4 py-3 text-sm text-white focus:border-lime focus:outline-none [&>option]:bg-night"
          >
            {SITE.locations.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end pb-1 text-[11px] text-muted-dark">
          {car.unavailable.length > 0
            ? `Blocked: ${car.unavailable.map((range) => `${range.from} to ${range.to}`).join(", ")}`
            : "Available year-round"}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {checkRow(chauffeur, setChauffeur, "Chauffeur", `+${formatPeso(1500)} / day`)}
        {checkRow(insurance, setInsurance, "Full insurance", `+${formatPeso(800)} / day`)}
        {checkRow(childSeat, setChildSeat, "Child seat", `+${formatPeso(300)} flat`)}
      </div>

      <div className="mt-5 grid gap-3">
        <Field
          label="Full name"
          name="customerName"
          value={customerName}
          onChange={setCustomerName}
          error={errors.customerName}
          autoComplete="name"
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Email"
            name="customerEmail"
            type="email"
            value={customerEmail}
            onChange={setCustomerEmail}
            error={errors.customerEmail}
            autoComplete="email"
            required
          />
          <Field
            label="Phone"
            name="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={setCustomerPhone}
            error={errors.customerPhone}
            autoComplete="tel"
            required
          />
        </div>
        <Field
          label={chauffeur ? "Driver's license (optional with chauffeur)" : "Driver's license number"}
          name="licenseNumber"
          value={licenseNumber}
          onChange={setLicenseNumber}
          error={errors.licenseNumber}
          placeholder="N01-23-456789"
          required={!chauffeur}
        />
      </div>

      <div className="mt-5 rounded-xl border border-line-dark bg-graphite/60 p-4 text-sm">
        <div className="flex justify-between text-white/70">
          <span>
            {formatPeso(car.dailyRate)} × {days} {days === 1 ? "day" : "days"}
          </span>
          <span>{formatPeso(quote.base)}</span>
        </div>
        {chauffeur ? (
          <div className="mt-1.5 flex justify-between text-white/60">
            <span>Chauffeur</span>
            <span>{formatPeso(1500 * days)}</span>
          </div>
        ) : null}
        {insurance ? (
          <div className="mt-1.5 flex justify-between text-white/60">
            <span>Insurance</span>
            <span>{formatPeso(800 * days)}</span>
          </div>
        ) : null}
        {childSeat ? (
          <div className="mt-1.5 flex justify-between text-white/60">
            <span>Child seat</span>
            <span>{formatPeso(300)}</span>
          </div>
        ) : null}
        <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-white/60">
          <span>Subtotal</span>
          <span>{formatPeso(quote.subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-white/60">
          <span>VAT (12%)</span>
          <span>{formatPeso(quote.vat)}</span>
        </div>
        <m.p
          key={quote.total}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="mt-2 flex justify-between border-t border-white/10 pt-2 font-display text-lg font-bold"
        >
          <span>Total</span>
          <span className="text-lime">{formatPeso(quote.total)}</span>
        </m.p>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[11px] leading-relaxed text-muted-dark">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-lime"
        />
        <span>
          I accept the rental terms and confirm I am at least 21 years old.
          {errors.consent ? (
            <span role="alert" className="mt-1 block text-red-400">
              {errors.consent}
            </span>
          ) : null}
        </span>
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark disabled:opacity-60"
      >
        {sending ? "Reserving…" : "Reserve this car"}
      </button>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-muted-dark">
        Demo booking — no payment is taken.
      </p>
    </form>
  );
}
