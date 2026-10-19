"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_BOOKINGS, type Booking } from "@/data/bookings";
import { canCancel, canTransition, type BookingStatus } from "@/lib/bookings";

const STORAGE_KEY = "driveph.bookings.v1";

type BookingsContextValue = {
  bookings: Booking[];
  hydrated: boolean;
  addBooking: (booking: Booking) => void;
  updateStatus: (ref: string, status: BookingStatus) => boolean;
  cancelBooking: (ref: string) => boolean;
};

const BookingsContext = createContext<BookingsContextValue | null>(null);

function loadBookings(raw: string | null): Booking[] {
  if (!raw) return SEED_BOOKINGS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_BOOKINGS;
    return parsed.filter(
      (item): item is Booking =>
        Boolean(item && typeof item.ref === "string" && typeof item.status === "string")
    );
  } catch {
    return SEED_BOOKINGS;
  }
}

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookings(loadBookings(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* storage unavailable */
    }
  }, [bookings, hydrated]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((current) => [booking, ...current]);
  }, []);

  const updateStatus = useCallback((ref: string, status: BookingStatus) => {
    let allowed = false;
    setBookings((current) =>
      current.map((booking) => {
        if (booking.ref !== ref || !canTransition(booking.status, status)) {
          return booking;
        }
        allowed = true;
        return { ...booking, status };
      })
    );
    return allowed;
  }, []);

  const cancelBooking = useCallback((ref: string) => {
    let allowed = false;
    setBookings((current) =>
      current.map((booking) => {
        if (booking.ref !== ref || !canCancel(booking.status)) return booking;
        allowed = true;
        return { ...booking, status: "cancelled" };
      })
    );
    return allowed;
  }, []);

  const value = useMemo(
    () => ({ bookings, hydrated, addBooking, updateStatus, cancelBooking }),
    [bookings, hydrated, addBooking, updateStatus, cancelBooking]
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings(): BookingsContextValue {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used within BookingsProvider");
  return context;
}
