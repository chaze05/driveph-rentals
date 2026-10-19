"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { validateLogin } from "@/lib/validation";
import { DEMO_USERS } from "@/lib/auth";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const { session, hydrated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && session) {
      const target = next || (session.role === "admin" ? "/admin" : "/dashboard");
      router.replace(target);
    }
  }, [hydrated, session, next, router]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    const loginError = login(email, password);
    if (loginError) {
      setError(loginError);
      return;
    }
    setError(null);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-line-dark bg-card p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lime">
          Demo access
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-dark">
          Client and admin dashboards are demo-only. Use an account below.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="client@driveph.ph"
              className="mt-1.5 w-full rounded-xl border border-line-dark bg-graphite px-4 py-3 text-sm text-white placeholder:text-muted-dark/60 focus:border-lime focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="demo1234"
              className="mt-1.5 w-full rounded-xl border border-line-dark bg-graphite px-4 py-3 text-sm text-white placeholder:text-muted-dark/60 focus:border-lime focus:outline-none"
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-night transition-colors hover:bg-lime-dark"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-line-dark bg-night/50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-dark">
            Demo accounts
          </p>
          <div className="mt-3 space-y-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                  setError(null);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-line-dark px-3 py-2.5 text-left text-xs transition-colors hover:border-lime/50"
              >
                <span>
                  <span className="block font-semibold text-white">{user.email}</span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-dark">
                    {user.role} · password: {user.password}
                  </span>
                </span>
                <span className="font-semibold text-lime">Use →</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] uppercase tracking-[0.14em] text-muted-dark">
          <Link href="/" className="transition-colors hover:text-white">
            ← Back to DrivePH
          </Link>
        </p>
      </div>
    </div>
  );
}
