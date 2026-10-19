import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARS, getCar } from "@/data/cars";
import { formatPeso } from "@/lib/format";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarBookingForm } from "@/components/cars/CarBookingForm";
import { CarCard } from "@/components/cars/CarCard";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CARS.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return { title: "Car not found — DrivePH Rentals" };
  return {
    title: `${car.name} — DrivePH Rentals`,
    description: `Rent the ${car.name} in ${car.location} from ${formatPeso(car.dailyRate)} per day.`,
    openGraph: { images: [car.images[0]] },
  };
}

export default async function CarPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const get = (key: string) => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  const car = getCar(slug);
  if (!car) notFound();

  const similar = CARS.filter(
    (item) => item.slug !== car.slug && (item.type === car.type || item.location === car.location)
  ).slice(0, 3);

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-page px-5">
          <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-muted-dark">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span aria-hidden="true" className="mx-2 text-white/20">/</span>
            <Link href="/cars" className="transition-colors hover:text-white">Fleet</Link>
            <span aria-hidden="true" className="mx-2 text-white/20">/</span>
            <span className="text-white/70" aria-current="page">{car.name}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
                {car.type} · {car.location}
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                {car.name}
              </h1>
            </div>
            <p className="text-sm text-muted-dark">
              {car.seats} seats · {car.doors} doors · {car.transmission}
            </p>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <CarGallery images={car.images} name={car.name} />

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Seats", value: car.seats },
                  { label: "Doors", value: car.doors },
                  { label: "Transmission", value: car.transmission },
                  { label: "Daily rate", value: formatPeso(car.dailyRate) },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-line-dark bg-card p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
                      {spec.label}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold">Included</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {car.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0 text-lime">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-2xl border border-line-dark bg-card p-5">
                <h2 className="font-display text-lg font-semibold">How booking works</h2>
                <ol className="mt-3 space-y-2 text-sm text-white/65">
                  <li>1. Pick your dates — we check them against this car&apos;s availability.</li>
                  <li>2. Add a chauffeur or insurance if you need them, then reserve.</li>
                  <li>3. We confirm within the hour and meet you at your pickup point.</li>
                </ol>
              </div>
            </div>

            <div className="h-fit lg:sticky lg:top-24">
              <CarBookingForm
                car={car}
                initialPickup={get("pickup")}
                initialReturn={get("return")}
              />
            </div>
          </div>

          {similar.length > 0 ? (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold">Similar cars</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((item, index) => (
                  <CarCard key={item.slug} car={item} index={index} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
