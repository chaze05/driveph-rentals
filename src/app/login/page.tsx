import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — DrivePH Rentals",
  description: "Demo sign-in for the DrivePH client and admin dashboards.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.next;
  const next = Array.isArray(raw) ? raw[0] : raw;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-page px-5">
        <LoginForm next={next} />
      </div>
    </section>
  );
}
