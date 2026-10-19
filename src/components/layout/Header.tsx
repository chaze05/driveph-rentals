"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Fleet", href: "/cars" },
  { label: "How it works", href: "/#how" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hydrated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dashboardHref = session?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark/80 bg-night/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-page items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime font-display text-sm font-bold text-night">
            D
          </span>
          <span className="font-display text-base font-bold uppercase tracking-[0.14em]">
            Drive<span className="text-lime">PH</span>
          </span>
          <span className="hidden text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-dark sm:block">
            Rentals
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors ${
                  active ? "text-lime" : "text-white/65 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          {hydrated && session ? (
            <>
              <Link
                href={dashboardHref}
                className="hidden min-h-10 items-center rounded-full border border-line-dark px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-lime/60 hover:text-lime sm:inline-flex"
              >
                {session.role === "admin" ? "Admin" : "My bookings"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="hidden min-h-10 items-center rounded-full px-3 py-2 text-xs font-semibold text-white/50 transition-colors hover:text-white sm:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden min-h-10 items-center rounded-full border border-line-dark px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-lime/60 hover:text-lime sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/cars"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-xs font-bold text-night transition-colors hover:bg-lime-dark"
          >
            Book now
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line-dark lg:hidden"
          >
            <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line-dark bg-night lg:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-page flex-col px-5 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line-dark/70 py-3 text-base font-medium text-white last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-wrap gap-2">
                {hydrated && session ? (
                  <>
                    <Link href={dashboardHref} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line-dark px-5 py-2.5 text-sm font-semibold">
                      {session.role === "admin" ? "Admin dashboard" : "My bookings"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        router.push("/");
                        setOpen(false);
                      }}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line-dark px-5 py-2.5 text-sm font-semibold text-white/70"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line-dark px-5 py-2.5 text-sm font-semibold"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
