"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/ui/Field";
import { validateInquiry, type InquiryDraft } from "@/lib/validation";

const empty: InquiryDraft = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<InquiryDraft>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const set = (key: keyof InquiryDraft) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateInquiry(form);
    setErrors(result as Record<string, string>);
    if (Object.keys(result).length > 0) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border border-lime/30 bg-lime/5 p-6 text-center">
        <p className="font-display text-xl font-bold">Message received.</p>
        <p className="mt-2 text-sm text-white/65">
          We&apos;ll reply within one business day — usually much sooner.
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted-dark">
          Demo form — enquiries are simulated.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line-dark bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" required />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" required />
        <Field label="Subject" name="subject" value={form.subject} onChange={set("subject")} error={errors.subject} required />
        <div className="sm:col-span-2">
          <Field label="Message" name="message" as="textarea" value={form.message} onChange={set("message")} error={errors.message} rows={5} required />
        </div>
      </div>
      <button
        type="submit"
        disabled={sending || !ready}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted-dark">
        Demo form — enquiries are simulated.
      </p>
    </form>
  );
}
