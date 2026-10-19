"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { findDemoUser, type Role } from "@/lib/auth";

const STORAGE_KEY = "driveph.auth.v1";

export type Session = { email: string; name: string; role: Role };

type AuthContextValue = {
  session: Session | null;
  hydrated: boolean;
  login: (email: string, password: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        if (parsed && parsed.role && parsed.email) setSession(parsed);
      }
    } catch {
      setSession(null);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [session, hydrated]);

  const login = useCallback((email: string, password: string) => {
    const user = findDemoUser(email, password);
    if (!user) return "Incorrect email or password. Use one of the demo accounts below.";
    setSession({ email: user.email, name: user.name, role: user.role });
    return null;
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const value = useMemo(
    () => ({ session, hydrated, login, logout }),
    [session, hydrated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
