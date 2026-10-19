"use client";

import { useBookings } from "@/components/providers/BookingsProvider";
import { CARS, getCar } from "@/data/cars";
import { formatDate, formatPeso } from "@/lib/format";
import { canCancel, canTransition, type BookingStatus } from "@/lib/bookings";
import { StatusBadge } from "@/components/ui/StatusBadge";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "active", "completed", "cancelled"];

export function AdminDashboard() {
  const { bookings, updateStatus, cancelBooking } = useBookings();

  const revenue = bookings
    .filter((booking) => ["confirmed", "active", "completed"].includes(booking.status))
    .reduce((sum, booking) => sum + booking.total, 0);
  const active = bookings.filter((booking) => booking.status === "active").length;
  const pending = bookings.filter((booking) => booking.status === "pending").length;

  const revenueByStatus = STATUSES.filter((status) =>
    ["confirmed", "active", "completed"].includes(status)
  ).map((status) => ({
    status,
    total: bookings
      .filter((booking) => booking.status === status)
      .reduce((sum, booking) => sum + booking.total, 0),
  }));
  const maxRevenue = Math.max(1, ...revenueByStatus.map((item) => item.total));

  const sorted = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const actionsFor = (ref: string, status: BookingStatus) => {
    const actions: { label: string; next: BookingStatus; tone: string }[] = [];
    if (canTransition(status, "confirmed")) {
      actions.push({ label: "Confirm", next: "confirmed", tone: "bg-ink text-white" });
    }
    if (canTransition(status, "active")) {
      actions.push({ label: "Start rental", next: "active", tone: "bg-emerald-600 text-white" });
    }
    if (canTransition(status, "completed")) {
      actions.push({ label: "Complete", next: "completed", tone: "bg-emerald-600 text-white" });
    }
    return actions.map((action) => (
      <button
        key={action.label}
        type="button"
        onClick={() => updateStatus(ref, action.next)}
        className={`min-h-9 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-90 ${action.tone}`}
      >
        {action.label}
      </button>
    ));
  };

  return (
    <section className="light-surface min-h-[70svh] bg-paper py-12 text-ink sm:py-16">
      <div className="mx-auto w-full max-w-page px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Admin dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Fleet &amp; bookings
          </h1>
          <p className="mt-2 text-sm text-muted">
            Move bookings through their lifecycle — demo data, stored locally.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Revenue", value: formatPeso(revenue) },
            { label: "Active rentals", value: active },
            { label: "Pending", value: pending },
            { label: "Fleet", value: CARS.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Revenue by status
          </h2>
          <div className="mt-4 space-y-3">
            {revenueByStatus.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-[11px] text-muted">
                  <span className="capitalize">{item.status}</span>
                  <span>{formatPeso(item.total)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.round((item.total / maxRevenue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">Bookings</h2>
          <div className="mt-4 space-y-3">
            {sorted.map((booking) => {
              const car = getCar(booking.carSlug);
              return (
                <div
                  key={booking.ref}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold">{booking.customerName}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {booking.ref} · {car?.name ?? booking.carSlug} · {booking.pickupLocation}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)} ·{" "}
                      {booking.customerEmail}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 font-display text-base font-bold">
                      {formatPeso(booking.total)}
                    </span>
                    {actionsFor(booking.ref, booking.status)}
                    {canCancel(booking.status) ? (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.ref)}
                        className="min-h-9 rounded-full border border-line px-3.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-500"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-bold">Fleet</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CARS.map((car) => (
              <div key={car.slug} className="rounded-2xl border border-line bg-white p-4">
                <p className="font-display text-sm font-bold">{car.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
                  {car.type} · {car.location}
                </p>
                <p className="mt-2 text-sm font-semibold">{formatPeso(car.dailyRate)}/day</p>
                <p className="mt-1 text-[10px] text-muted">
                  {car.unavailable.length > 0
                    ? `${car.unavailable.length} blocked range(s)`
                    : "Always available"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.14em] text-muted">
          Demo admin — status changes are stored in this browser only.
        </p>
      </div>
    </section>
  );
}
