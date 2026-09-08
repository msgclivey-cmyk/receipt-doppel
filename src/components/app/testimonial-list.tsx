"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { formatMoney, relativeTime } from "@/lib/utils";
import { PaidVerifiedBadge } from "@/components/proof/badges";

type Testimonial = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorEmailMask: string | null;
  body: string;
  amountCents: number;
  provider: string;
  published: boolean;
  createdAt: string | Date;
};

export function TestimonialPublishList({
  initial,
}: {
  initial: Testimonial[];
}) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(id: string, published: boolean) {
    setError(null);
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published } : t)),
    );
    startTransition(async () => {
      const res = await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published }),
      });
      if (!res.ok) {
        setError("Could not update publish state.");
        setItems(initial);
        return;
      }
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--rd-muted)]">
        No testimonials yet. Connect payments in Settings to sync demo charges.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="text-sm text-[var(--rd-danger)]">{error}</p>
      ) : null}
      {items.map((t) => (
        <div
          key={t.id}
          className="flex flex-col gap-3 border-b border-[var(--rd-line)] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-start"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--rd-mint)] text-xs font-bold text-[var(--rd-forest)]">
            {t.authorInitials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <PaidVerifiedBadge />
              <span className="text-xs text-[var(--rd-muted)]">
                {t.authorEmailMask} · {formatMoney(t.amountCents)} ·{" "}
                {t.provider === "paddle" ? "Paddle" : "Stripe"}
              </span>
              <span className="text-xs text-[var(--rd-muted)]">
                {relativeTime(t.createdAt)}
              </span>
            </div>
            <p className="text-sm text-[var(--rd-ink)]">{t.body}</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-start">
            <span className="text-xs text-[var(--rd-muted)]">Publish</span>
            <Switch
              checked={t.published}
              disabled={pending}
              onCheckedChange={(v) => toggle(t.id, v)}
              aria-label={`Publish testimonial from ${t.authorName}`}
            />
          </div>
        </div>
      ))}
      <Link
        href="/proof/acme-brew"
        className="inline-block text-sm font-semibold text-[var(--rd-forest)]"
      >
        View all testimonials →
      </Link>
    </div>
  );
}
