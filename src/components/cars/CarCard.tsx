"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import type { Car } from "@/data/cars";
import { formatPeso } from "@/lib/format";

export function CarCard({
  car,
  index = 0,
  pickup,
  returnDate,
}: {
  car: Car;
  index?: number;
  pickup?: string;
  returnDate?: string;
}) {
  const params = new URLSearchParams();
  if (pickup) params.set("pickup", pickup);
  if (returnDate) params.set("return", returnDate);
  const href = `/cars/${car.slug}${params.size ? `?${params.toString()}` : ""}`;

  return (
    <m.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-line-dark bg-card"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            quality={62}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-night/75 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
            {car.type}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {car.name}
              </h3>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-dark">
                {car.location} · {car.transmission}
              </p>
            </div>
            <p className="whitespace-nowrap text-right">
              <span className="font-display text-xl font-bold text-lime">
                {formatPeso(car.dailyRate)}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.14em] text-muted-dark">
                per day
              </span>
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-line-dark pt-4 text-[11px] text-white/55">
            <span>{car.seats} seats</span>
            <span>{car.doors} doors</span>
            <span className="ml-auto font-semibold text-lime">Book →</span>
          </div>
        </div>
      </Link>
    </m.article>
  );
}
