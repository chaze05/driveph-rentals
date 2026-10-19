"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";

const FOCUSABLE = "button";

export function CarGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const go = (direction: number) => {
    setIndex((current) => (current + direction + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, images.length]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1fr_0.34fr]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open photo gallery"
          className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line-dark"
        >
          <Image
            src={images[index]}
            alt={`${name} — photo ${index + 1}`}
            fill
            priority
            quality={60}
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-night/75 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
            View all photos
          </span>
        </button>

        <div className="hidden grid-rows-2 gap-3 sm:grid">
          {images.slice(1, 3).concat(images.slice(0, 1)).slice(0, 2).map((image, thumbIndex) => (
            <button
              key={`${image}-${thumbIndex}`}
              type="button"
              onClick={() => {
                setIndex(thumbIndex + 1 < images.length ? thumbIndex + 1 : 0);
                setOpen(true);
              }}
              aria-label={`Open photo ${thumbIndex + 2}`}
              className="relative overflow-hidden rounded-2xl border border-line-dark"
            >
              <Image
                src={image}
                alt={`${name} — photo ${thumbIndex + 2}`}
                fill
                quality={60}
                sizes="240px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${name} photo gallery`}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <div className="relative h-[70vh] w-full">
                <Image
                  src={images[index]}
                  alt={`${name} — photo ${index + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-white/60">
                {name} · {index + 1} / {images.length}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close gallery"
                className="absolute -top-2 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
