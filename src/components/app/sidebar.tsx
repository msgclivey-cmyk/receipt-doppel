"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  ShieldAlert,
  Puzzle,
  Settings,
  LogOut,
} from "lucide-react";
import { BrandMark, ShieldLogo } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions";

export function AppSidebar({
  brandName,
  brandSlug,
  openThreats,
}: {
  brandName: string;
  brandSlug: string;
  openThreats: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--rd-line)] bg-white">
      <div className="border-b border-[var(--rd-line)] px-4 py-4">
        <BrandMark href="/app" compact />
        <p className="mt-2 truncate text-xs text-[var(--rd-muted)]">{brandName}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {[
          { href: "/app", label: "Live testimonials", icon: MessageSquareQuote, match: undefined as string | undefined },
          { href: "/app#threats", label: "Impersonation queue", icon: ShieldAlert, match: undefined },
          { href: `/proof/${brandSlug}`, label: "Proof Wall", icon: LayoutDashboard, match: undefined },
          { href: "/app/settings", label: "Integrations", icon: Puzzle, match: undefined },
          { href: "/app/settings", label: "Settings", icon: Settings, match: "/app/settings" },
        ].map((item) => {
          const Icon = item.icon;
          const active =
            item.match != null
              ? pathname.startsWith(item.match)
              : item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href.split("#")[0]) &&
                  item.href !== "/app";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--rd-ink)] transition-colors",
                active
                  ? "border-l-2 border-[var(--rd-forest)] bg-[var(--rd-mint)] text-[var(--rd-forest)]"
                  : "hover:bg-[var(--rd-mist)]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.label.includes("Impersonation") && openThreats > 0 ? (
                <span className="rounded-full bg-[var(--rd-danger)] px-1.5 text-[10px] text-white">
                  {openThreats}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--rd-line)] p-4">
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-[var(--rd-mint)] p-3 text-xs text-[var(--rd-forest)]">
          <ShieldLogo size={18} className="mt-0.5 shrink-0 text-[var(--rd-forest)]" />
          <div>
            <p className="font-semibold">Your brand is protected</p>
            <p className="opacity-80">We&apos;re monitoring 24/7.</p>
          </div>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </form>
      </div>
    </aside>
  );
}
