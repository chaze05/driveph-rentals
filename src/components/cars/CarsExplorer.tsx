"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { CAR_TYPES, CARS } from "@/data/cars";
import { SITE } from "@/data/site";
import { filterCars } from "@/lib/filters";
import { CarCard } from "./CarCard";

const SEATS = [
  { label: "Any seats", value: 0 },
  { label: "4+ seats", value: 4 },
  { label: "5+ seats", value: 5 },
  { label: "7+ seats", value: 7 },
  { label: "12+ seats", value: 12 },
];

const BUDGETS = [
  { label: "Any budget", value: 0 },
  { label: "Up to ₱2,500", value: 2500 },
  { label: "Up to ₱3,500", value: 3500 },
  { label: "Up to ₱4,500", value: 4500 },
  { label: "Up to ₱6,000", value: 6000 },
];

const selectClasses =
  "w-full rounded-xl border border-line-dark bg-graphite px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none [&>option]:bg-night";

export type CarSearchInitial = {
  query: string;
  type: string;
  location: string;
  transmission: string;
  seats: number;
  maxPrice: number;
  pickup: string;
  returnDate: string;
};

export function CarsExplorer({ initial }: { initial: CarSearchInitial }) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initial.query);
  const [type, setType] = useState(initial.type);
  const [location, setLocation] = useState(initial.location);
  const [transmission, setTransmission] = useState(initial.transmission);
  const [seats, setSeats] = useState(initial.seats);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { pickup, returnDate } = initial;

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (transmission) params.set("transmission", transmission);
    if (seats) params.set("seats", String(seats));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (pickup) params.set("pickup", pickup);
    if (returnDate) params.set("return", returnDate);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, type, location, transmission, seats, maxPrice, pickup, returnDate, pathname, router]);

  const results = useMemo(
    () => filterCars(CARS, { query, type, location, transmission, seats, maxPrice }),
    [query, type, location, transmission, seats, maxPrice]
  );

  const activeCount = [
    query,
    type,
    location,
    transmission,
    seats > 0 ? "seats" : "",
    maxPrice > 0 ? "price" : "",
  ].filter(Boolean).length;

  const clearAll = () => {
    setQuery("");
    setType("");
    setLocation("");
    setTransmission("");
    setSeats(0);
    setMaxPrice(0);
  };

  const controls = (
    <div className="space-y-5">
      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
          Search
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Car, city or keyword…"
          className="mt-1.5 w-full rounded-xl border border-line-dark bg-graphite px-4 py-2.5 text-sm text-white placeholder:text-muted-dark/70 focus:border-lime focus:outline-none"
        />
      </label>

      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
          Vehicle type
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType("")}
            aria-pressed={type === ""}
            className={`min-h-9 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              type === ""
                ? "border-lime bg-lime text-night"
                : "border-line-dark bg-transparent text-white/70 hover:border-lime/50"
            }`}
          >
            All
          </button>
          {CAR_TYPES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              aria-pressed={type === item}
              className={`min-h-9 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                type === item
                  ? "border-lime bg-lime text-night"
                  : "border-line-dark bg-transparent text-white/70 hover:border-lime/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
            City
          </span>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className={`${selectClasses} mt-1.5`}
          >
            <option value="">All cities</option>
            {SITE.locations.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
            Transmission
          </span>
          <select
            value={transmission}
            onChange={(event) => setTransmission(event.target.value)}
            className={`${selectClasses} mt-1.5`}
          >
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
            Seats
          </span>
          <select
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
            className={`${selectClasses} mt-1.5`}
          >
            {SEATS.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
            Daily budget
          </span>
          <select
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className={`${selectClasses} mt-1.5`}
          >
            {BUDGETS.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {pickup && returnDate ? (
        <p className="rounded-xl border border-lime/25 bg-lime/5 px-3 py-2.5 text-[11px] text-lime">
          Showing cars for {pickup} → {returnDate}
        </p>
      ) : null}

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={clearAll}
          className="min-h-9 w-full text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-dark transition-colors hover:text-white"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-line-dark bg-card p-5">
          {controls}
        </div>
      </aside>

      <div>
        <h2 className="sr-only">Fleet results</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-dark">
            <strong className="font-display text-base text-white">{results.length}</strong>{" "}
            {results.length === 1 ? "car" : "cars"}
            {activeCount > 0 ? " matching" : ""}
          </p>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-dark px-4 py-2 text-xs font-semibold text-white lg:hidden"
          >
            Filters
            {activeCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[10px] text-night">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>

        {results.length > 0 ? (
          <m.div layout className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((car, index) => (
                <CarCard
                  key={car.slug}
                  car={car}
                  index={index}
                  pickup={pickup}
                  returnDate={returnDate}
                />
              ))}
            </AnimatePresence>
          </m.div>
        ) : (
          <div className="mt-6 rounded-2xl border border-line-dark bg-card px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold">
              No cars match these filters.
            </p>
            <p className="mt-2 text-sm text-muted-dark">
              Try another city, type or budget.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 min-h-11 rounded-full bg-lime px-6 py-2.5 text-sm font-bold text-night"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <m.button
              type="button"
              aria-label="Close filters"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-night/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <m.aside
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute right-0 top-0 h-full w-[92%] max-w-sm overflow-y-auto border-l border-line-dark bg-night p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-lg font-semibold">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line-dark"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              {controls}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night"
              >
                Show {results.length} cars
              </button>
            </m.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
