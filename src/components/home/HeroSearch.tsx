"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { CAR_TYPES } from "@/data/cars";
import { SITE } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

const selectClasses =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white focus:border-lime focus:outline-none [&>option]:bg-night";

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [type, setType] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (pickup) params.set("pickup", pickup);
    if (returnDate) params.set("return", returnDate);
    router.push(`/cars${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Sports car on an open road"
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/30" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40" />

      <div className="relative mx-auto w-full max-w-page px-5 pb-20 pt-24 sm:pt-28">
        <m.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] font-semibold uppercase tracking-[0.32em] text-lime"
        >
          Car rental · Philippines
        </m.p>
        <m.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,6.6vw,4.8rem)] font-bold leading-[1.02]"
        >
          Drive the <span className="text-lime">islands.</span>
        </m.h1>
        <m.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/70"
        >
          {SITE.description}
        </m.p>

        <m.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 rounded-2xl border border-white/10 bg-night/70 p-4 backdrop-blur-xl sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Pickup city
              <select
                aria-label="Pickup city"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={selectClasses}
              >
                <option value="">All cities</option>
                {SITE.locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Pickup date
              <input
                aria-label="Pickup date"
                type="date"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
                className={selectClasses}
              />
            </label>
            <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Return date
              <input
                aria-label="Return date"
                type="date"
                value={returnDate}
                min={pickup || undefined}
                onChange={(event) => setReturnDate(event.target.value)}
                className={selectClasses}
              />
            </label>
            <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Vehicle type
              <select
                aria-label="Vehicle type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className={selectClasses}
              >
                <option value="">Any type</option>
                {CAR_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark lg:mt-[19px]"
            >
              Find cars
            </button>
          </div>
        </m.form>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] text-white/55">
          <span><strong className="font-display text-sm text-white">8</strong> cars</span>
          <span><strong className="font-display text-sm text-white">4</strong> islands</span>
          <span><strong className="font-display text-sm text-white">24/7</strong> roadside help</span>
          <span><strong className="font-display text-sm text-lime">₱2,200</strong> from / day</span>
        </div>
      </div>
    </section>
  );
}
