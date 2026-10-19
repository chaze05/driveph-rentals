import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact — DrivePH Rentals",
  description: "Questions about a rental? Message DrivePH Rentals — we reply within one business day.",
};

export default function ContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Questions? <span className="text-lime">We answer.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-dark">
            Whether it&apos;s a long-term rental, an airport pickup or a route
            question, message us and a real person replies.
          </p>

          <dl className="mt-9 space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-dark">Visit</dt>
              <dd className="mt-1 text-white/75">{SITE.address}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-dark">Talk to us</dt>
              <dd className="mt-1">
                <a className="text-white/75 transition-colors hover:text-lime" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
                  {SITE.phone}
                </a>
                <span className="mx-2 text-white/20">·</span>
                <a className="text-white/75 transition-colors hover:text-lime" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-dark">Hours</dt>
              <dd className="mt-1 text-white/75">{SITE.hours}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
