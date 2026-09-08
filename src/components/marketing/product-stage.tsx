"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, TriangleAlert } from "lucide-react";
import { PaidVerifiedBadge, TrustInlineBadge } from "@/components/proof/badges";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { LandingBrand, LandingReview, LandingThreat } from "@/lib/landing";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "proof", label: "Proof wall" },
  { id: "badge", label: "Storefront" },
  { id: "guard", label: "Takedowns" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function threatLabel(threat: LandingThreat) {
  if (threat.severity === "critical") return "Critical";
  if (threat.severity === "high") return "High";
  return "Medium";
}

function BrowserChrome({
  url,
  toolbar,
  children,
}: {
  url: string;
  toolbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--rd-line)] bg-white shadow-[0_20px_50px_-28px_rgba(20,32,27,0.4)]">
      <div className="flex items-center gap-2 border-b border-[var(--rd-line)] bg-[var(--rd-mist)] px-3 py-2">
        <div className="hidden gap-1.5 sm:flex" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8b4b4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6d59a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b5d4c4]" />
        </div>
        <p className="min-w-0 flex-1 truncate rounded-md bg-white px-2.5 py-1 font-mono text-[11px] text-[var(--rd-muted)] ring-1 ring-[var(--rd-line)]">
          {url}
        </p>
      </div>
      {toolbar}
      {children}
    </div>
  );
}

function ProofPanel({
  brand,
  reviews,
  selectedId,
  onSelect,
}: {
  brand: LandingBrand;
  reviews: LandingReview[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = reviews.find((r) => r.id === selectedId) ?? reviews[0];
  const shown = reviews.slice(0, 3);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <p className="truncate text-sm font-bold text-[var(--rd-ink)]">
          {brand.name}
        </p>
        <p className="shrink-0 text-[11px] text-[var(--rd-muted)]">
          {reviews.length} verified · Stripe
        </p>
      </div>
      <ul className="min-h-0 flex-1 space-y-1.5 overflow-auto p-3">
        {shown.map((review) => {
          const active = selected?.id === review.id;
          return (
            <li key={review.id}>
              <button
                type="button"
                onClick={() => onSelect(review.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left transition-colors duration-200",
                  active
                    ? "border-[var(--rd-forest)] bg-[var(--rd-mint)]"
                    : "border-[var(--rd-line)] bg-white hover:border-[var(--rd-forest)]/35",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[var(--rd-forest)] ring-1 ring-[var(--rd-line)]">
                    {review.authorInitials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">
                        {review.authorName}
                      </span>
                      <PaidVerifiedBadge />
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-[var(--rd-muted)]">
                      “{review.body}”
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected ? (
        <div className="border-t border-[var(--rd-line)] bg-[var(--rd-mist)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--rd-forest)]">
            Bound to a real charge
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="capitalize">{selected.provider}</span>
            <span className="font-mono text-xs">#{selected.orderRef}</span>
            <span className="font-semibold">
              {formatMoney(selected.amountCents, selected.currency)}
            </span>
            <Link
              href={`/proof/${brand.slug}`}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--rd-forest)] hover:underline"
            >
              Full wall <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BadgePanel({
  brand,
  reviews,
}: {
  brand: LandingBrand;
  reviews: LandingReview[];
}) {
  const featured = reviews[0];
  return (
    <div className="grid h-full min-h-0 grid-cols-[140px_minmax(0,1fr)]">
      <div className="flex items-center justify-center bg-gradient-to-b from-[#1a120c] to-[#3a2618] p-4">
        <div className="flex h-36 w-[4.5rem] flex-col items-center justify-end rounded-full border border-white/10 bg-gradient-to-b from-[#c4a484] to-[#6b4423] pb-3">
          <p className="px-1 text-center text-[8px] font-bold uppercase tracking-widest text-white/90">
            {brand.name}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2.5 p-4">
        <p className="text-xs text-amber-600">
          ★★★★★ {reviews.length} verified reviews
        </p>
        <h3 className="text-lg font-bold tracking-tight">House Cold Brew · 32oz</h3>
        <TrustInlineBadge
          className="max-w-full"
          provider={brand.paymentProvider === "paddle" ? "Paddle" : "Stripe"}
        />
        <p className="text-2xl font-bold">
          {featured ? formatMoney(featured.amountCents, featured.currency) : "$28"}
        </p>
        <Link
          href="/badge-demo"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--rd-forest)] hover:underline"
        >
          Full storefront demo <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function GuardPanel({
  threats,
  selectedId,
  onSelect,
}: {
  threats: LandingThreat[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = threats.find((t) => t.id === selectedId) ?? threats[0];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ul className="min-h-0 flex-1 space-y-1.5 overflow-auto p-3">
        {threats.map((threat) => {
          const active = selected?.id === threat.id;
          return (
            <li key={threat.id}>
              <button
                type="button"
                onClick={() => onSelect(threat.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left transition-colors duration-200",
                  active
                    ? "border-[var(--rd-danger)]/40 bg-red-50/80"
                    : "border-[var(--rd-line)] hover:border-[var(--rd-danger)]/25",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--rd-ink)]">
                    {threat.title}
                  </span>
                  <Badge
                    variant={threat.severity === "critical" ? "danger" : "warn"}
                    className="shrink-0"
                  >
                    {threatLabel(threat)}
                  </Badge>
                </span>
                {threat.url ? (
                  <span className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-[var(--rd-muted)]">
                    <Globe className="h-3 w-3" />
                    {threat.url.replace(/^https?:\/\//, "")}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {selected ? (
        <div className="border-t border-[var(--rd-line)] bg-[var(--rd-mist)] px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--rd-danger)]">
            <TriangleAlert className="h-3.5 w-3.5" />
            {selected.type.replaceAll("_", " ")}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--rd-muted)]">
            {selected.summary}
          </p>
          <Link
            href="/login"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--rd-forest)] hover:underline"
          >
            Open in console <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function ProductStage({
  brand,
  reviews,
  threats,
}: {
  brand: LandingBrand;
  reviews: LandingReview[];
  threats: LandingThreat[];
}) {
  const tabId = useId();
  const [tab, setTab] = useState<TabId>("proof");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reviewId, setReviewId] = useState(reviews[0]?.id ?? null);
  const [threatId, setThreatId] = useState(threats[0]?.id ?? null);

  const selectTab = useCallback((next: TabId) => {
    setTab(next);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let value = 0;
    const id = window.setInterval(() => {
      value += 2;
      if (value >= 100) {
        setTab((current) => {
          const index = TABS.findIndex((item) => item.id === current);
          return TABS[(index + 1) % TABS.length].id;
        });
        setProgress(0);
        value = 0;
        return;
      }
      setProgress(value);
    }, 120);
    return () => window.clearInterval(id);
  }, [paused, tab]);

  const urls = {
    proof: `receiptdoppel.demo/proof/${brand.slug}`,
    badge: "acmebrewco.com/products/cold-brew",
    guard: "receiptdoppel.demo/app/threats",
  };

  return (
    <div
      className="rd-stage w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <BrowserChrome
        url={urls[tab]}
        toolbar={
          <div
            role="tablist"
            aria-label="Product surfaces"
            className="flex border-b border-[var(--rd-line)] bg-white px-1"
          >
            {TABS.map((item) => {
              const selected = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${tabId}-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${tabId}-panel`}
                  onClick={() => selectTab(item.id)}
                  className={cn(
                    "relative flex-1 px-2 py-2.5 text-center text-sm font-semibold transition-colors duration-200",
                    selected
                      ? "text-[var(--rd-forest)]"
                      : "text-[var(--rd-muted)] hover:text-[var(--rd-ink)]",
                  )}
                >
                  {item.label}
                  {selected ? (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--rd-forest)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        }
      >
        <div
          role="tabpanel"
          id={`${tabId}-panel`}
          aria-labelledby={`${tabId}-${tab}`}
          className="rd-stage-panel h-[22.5rem]"
        >
          {tab === "proof" ? (
            <ProofPanel
              brand={brand}
              reviews={reviews}
              selectedId={reviewId}
              onSelect={setReviewId}
            />
          ) : null}
          {tab === "badge" ? (
            <BadgePanel brand={brand} reviews={reviews} />
          ) : null}
          {tab === "guard" ? (
            <GuardPanel
              threats={threats}
              selectedId={threatId}
              onSelect={setThreatId}
            />
          ) : null}
        </div>
        <div className="h-0.5 bg-[var(--rd-line)]">
          <div
            className="h-full bg-[var(--rd-forest)] transition-[width] duration-100 ease-linear"
            style={{ width: `${paused ? 0 : progress}%` }}
          />
        </div>
      </BrowserChrome>
    </div>
  );
}
