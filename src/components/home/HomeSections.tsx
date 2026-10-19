import Link from "next/link";
import { CARS } from "@/data/cars";
import { SITE } from "@/data/site";
import { CarCard } from "@/components/cars/CarCard";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedFleet() {
  const featured = CARS.slice(0, 4);

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-page px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
              The fleet
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Pick your ride.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/cars"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lime transition-opacity hover:opacity-80"
            >
              View all cars →
            </Link>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((car, index) => (
            <CarCard key={car.slug} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      title: "Choose your car",
      text: "Filter by city, type and budget — every rate is the real daily price.",
    },
    {
      title: "Book your dates",
      text: "Pick up and return dates are checked against live availability.",
    },
    {
      title: "Drive",
      text: "Meet us at the airport or city branch. Insurance and extras are optional.",
    },
  ];

  return (
    <section id="how" className="border-y border-line-dark bg-graphite/40 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-page px-5">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold sm:text-4xl">
            Three steps, then the open road.
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <div className="h-full rounded-2xl border border-line-dark bg-card p-6">
                <span className="font-display text-2xl font-bold text-lime/50">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-dark">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationsStrip() {
  return (
    <section className="py-14">
      <div className="mx-auto w-full max-w-page px-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-dark">
            Pick up in
          </span>
          {SITE.locations.map((city) => (
            <Link
              key={city}
              href={`/cars?location=${encodeURIComponent(city)}`}
              className="min-h-10 rounded-full border border-line-dark px-4 py-2 text-xs font-semibold text-white/75 transition-colors hover:border-lime/60 hover:text-lime"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto w-full max-w-page px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line-dark bg-card px-6 py-14 text-center sm:px-16">
            <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lime/10 blur-[90px]" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-lime/10 blur-[90px]" />
            <p className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
              Ready when you are
            </p>
            <h2 className="relative mt-4 font-display text-3xl font-bold sm:text-4xl">
              The islands are waiting.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/65">
              Book online in two minutes — or message us and we&apos;ll plan the
              trip around your dates.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/cars"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark"
              >
                Book a car
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-lime/60"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
