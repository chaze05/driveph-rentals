import Link from "next/link";
import { SITE } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark bg-[#07080C] text-white">
      <div className="mx-auto w-full max-w-page px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime font-display text-sm font-bold text-night">
                D
              </span>
              <span className="font-display text-base font-bold uppercase tracking-[0.14em]">
                Drive<span className="text-lime">PH</span> Rentals
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {SITE.description}
            </p>
            <p className="mt-6 font-display text-sm uppercase tracking-[0.24em] text-lime">
              {SITE.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
              Explore
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              <li><Link className="transition-colors hover:text-lime" href="/cars">Fleet</Link></li>
              <li><Link className="transition-colors hover:text-lime" href="/#how">How it works</Link></li>
              <li><Link className="transition-colors hover:text-lime" href="/contact">Contact</Link></li>
              <li><Link className="transition-colors hover:text-lime" href="/login">Client login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
              Visit
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              <li>{SITE.address}</li>
              <li><a className="transition-colors hover:text-lime" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></li>
              <li><a className="transition-colors hover:text-lime" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li className="text-white/65">{SITE.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>Â© {year} {SITE.name}. All rights reserved.</p>
          <p className="uppercase tracking-[0.22em]">Manila Â· Cebu Â· Bohol Â· Siargao</p>
        </div>
      </div>
    </footer>
  );
}
