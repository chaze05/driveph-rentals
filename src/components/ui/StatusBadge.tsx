import type { BookingStatus } from "@/lib/bookings";

const STYLES: Record<BookingStatus, string> = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-500",
  confirmed: "border-sky-400/30 bg-sky-400/10 text-sky-500",
  active: "border-lime-dark/40 bg-lime/20 text-night",
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-600",
  cancelled: "border-red-400/30 bg-red-400/10 text-red-500",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${STYLES[status]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
