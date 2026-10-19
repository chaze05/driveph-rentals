import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center">
      <div className="mx-auto w-full max-w-page px-5 py-24 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
          404 — Wrong turn
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
          Dead end.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/65">
          The page you were looking for doesn&apos;t exist. Let&apos;s get you back
          on the road.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/cars"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark"
          >
            Browse cars
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-lime/60"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
