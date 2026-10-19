"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBookings } from "@/components/providers/BookingsProvider";
import { getCar } from "@/data/cars";
import { formatDate, formatPeso } from "@/lib/format";
import { canCancel } from "@/lib/bookings";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ClientDashboard() {
  const { session } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  const [confirming, setConfirming] = useState<string | null>(null);

  if (!session) return null;

  const today = new Date().toISOString().slice(0, 10);
  const mine = bookings
    .filter((booking) => booking.customerEmail.toLowerCase() === session.email.toLowerCase())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const upcoming = mine.filter(
    (booking) =>
      booking.pickupDate >= today &&
      (booking.status === "pending" || booking.status === "confirmed" || booking.status === "active")
  );
  const spent = mine
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.total, 0);

  return (
    <section className="light-surface min-h-[70svh] bg-paper py-12 text-ink sm:py-16">
      <div className="mx-auto w-full max-w-page px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Client dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Hello, {session.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-sm text-muted">
              Your bookings, saved in this browser — demo only.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-graphite"
          >
            Book another car
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Bookings", value: mine.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Total spent", value: formatPeso(spent) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">My bookings</h2>

          {mine.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-line bg-white px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold">No bookings yet.</p>
              <p className="mt-1 text-sm text-muted">
                Your reservations will appear here after you book a car.
              </p>
              <Link
                href="/cars"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
              >
                Browse the fleet
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {mine.map((booking) => {
                const car = getCar(booking.carSlug);
                return (
                  <div
                    key={booking.ref}
                    className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-semibold">
                          {car?.name ?? booking.carSlug}
                        </p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {booking.ref} · {booking.pickupLocation} ·{" "}
                        {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {booking.chauffeur ? "With chauffeur" : "Self-drive"}
                        {booking.insurance ? " · insured" : ""}
                        {booking.childSeat ? " · child seat" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="font-display text-lg font-bold">
                        {formatPeso(booking.total)}
                      </p>
                      {canCancel(booking.status) ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirming === booking.ref) {
                              cancelBooking(booking.ref);
                              setConfirming(null);
                            } else {
                              setConfirming(booking.ref);
                            }
                          }}
                          className={`min-h-9 rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                            confirming === booking.ref
                              ? "border-red-400 bg-red-50 text-red-600"
                              : "border-line text-muted hover:border-red-300 hover:text-red-500"
                          }`}
                        >
                          {confirming === booking.ref ? "Confirm cancel" : "Cancel"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.14em] text-muted">
          Demo dashboard — bookings are stored in this browser only.
        </p>
      </div>
    </section>
  );
}
