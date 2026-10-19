"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuthGate({
  role,
  children,
}: {
  role?: "admin";
  children: ReactNode;
}) {
  const { session, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (role === "admin" && session.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [hydrated, session, role, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <p className="text-sm text-muted-dark">Loading dashboard…</p>
      </div>
    );
  }

  if (!session) return null;
  if (role === "admin" && session.role !== "admin") return null;

  return <>{children}</>;
}
