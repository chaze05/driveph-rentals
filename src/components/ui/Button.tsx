"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "lime" | "ghost" | "dark" | "light";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  lime: "bg-lime text-night hover:bg-lime-dark",
  ghost: "border border-white/20 text-white hover:border-lime/60",
  dark: "bg-night text-white hover:bg-graphite",
  light: "border border-line bg-white text-ink hover:border-lime-dark/60",
};

export function Button({
  children,
  href,
  onClick,
  variant = "lime",
  type = "button",
  disabled,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
