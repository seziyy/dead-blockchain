"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/chains");

  return (
    <header className="sticky top-0 z-50 border-b-2 border-app-line bg-app-bg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 pr-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-app-line bg-app-surface text-xl shadow-[2px_2px_0_rgb(var(--color-line))]">
            <Bot size={22} strokeWidth={2.5} />
          </span>
          <span className="hidden truncate text-sm font-black uppercase text-app-text sm:block">
            Dead Blockchain Theory
          </span>
        </Link>

        <Link
          href="/dashboard"
          className={cn(
            "focus-ring brutal-button inline-flex h-10 items-center gap-2 px-4 text-sm font-black",
            isDashboard
              ? "accent-stamp"
              : "bg-app-surface text-app-text hover:bg-app-elevated"
          )}
        >
          <span className="hidden sm:inline">Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </header>
  );
}
