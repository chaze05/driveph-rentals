import type { Metadata } from "next";
import { CarsExplorer, type CarSearchInitial } from "@/components/cars/CarsExplorer";

export const metadata: Metadata = {
  title: "Fleet — DrivePH Rentals",
  description:
    "Browse the DrivePH fleet: sedans, SUVs, MPVs, vans and pickups across Manila, Cebu, Bohol and Siargao.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  const initial: CarSearchInitial = {
    query: get("q"),
    type: get("type"),
    location: get("location"),
    transmission: get("transmission"),
    seats: Number(get("seats") || 0),
    maxPrice: Number(get("maxPrice") || 0),
    pickup: get("pickup"),
    returnDate: get("return"),
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-page px-5">
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-muted-dark">
          <a href="/" className="transition-colors hover:text-white">Home</a>
          <span aria-hidden="true" className="mx-2 text-white/20">/</span>
          <span className="text-white/70" aria-current="page">Fleet</span>
        </nav>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
          The fleet
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Pick your ride.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-dark sm:text-base">
          Every car is serviced, insured and ready at the city branch or airport.
          Rates shown are the real daily price.
        </p>

        <div className="mt-9">
          <CarsExplorer initial={initial} />
        </div>
      </div>
    </section>
  );
}
