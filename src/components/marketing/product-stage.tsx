"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Globe,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { PaidVerifiedBadge, TrustInlineBadge } from "@/components/proof/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { LandingBrand, LandingReview, LandingThreat } from "@/lib/landing";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "proof",
    label: "Proof wall",
    hint: "Paid reviews, live",
  },
  {
    id: "badge",
    label: "Storefront badge",
    hint: "On the product page",
  },
  {
    id: "guard",
    label: "Takedown queue",
    hint: "Impersonation defense",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

function threatLabel(threat: LandingThreat) {
  if (threat.severity === "critical") return "Critical";
  if (threat.severity === "high") return "High risk";
  return "Medium";
}

function BrowserChrome({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--rd-line)] bg-white shadow-[0_24px_80px_-32px_rgba(20,32,27,0.45)]">
      <div className="flex items-center gap-3 border-b border-[var(--rd-line)] bg-[var(--rd-mist)] px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8b4b4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6d59a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b5d4c4]" />
        </div>
        <p className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 font-mono text-[11px] text-[var(--rd-muted)] ring-1 ring-[var(--rd-line)]">
          {url}
        </p>
      </div>
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

  return (
    <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rd-muted)]">
              Customer proof
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--rd-ink)]">
              {brand.name}
            </p>
          </div>
          <p className="text-xs text-[var(--rd-muted)]">
            {reviews.length} verified · 0 disputed ·{" "}
            {brand.paymentConnected
              ? brand.paymentProvider === "paddle"
                ? "Paddle"
                : "Stripe"
              : "Not connected"}
          </p>
        </div>
        <ul className="space-y-2">
          {reviews.slice(0, 4).map((review) => {
            const active = selected?.id === review.id;
            return (
              <li key={review.id}>
                <button
                  type="button"
                  onClick={() => onSelect(review.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-all duration-300",
                    active
                      ? "border-[var(--rd-forest)] bg-[var(--rd-mint)] shadow-sm"
                      : "border-[var(--rd-line)] bg-white hover:border-[var(--rd-forest)]/40",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--rd-forest)] ring-1 ring-[var(--rd-line)]">
                      {review.authorInitials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[var(--rd-ink)]">
                          {review.authorName}
                        </span>
                        <PaidVerifiedBadge />
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-[var(--rd-muted)]">
                        “{review.body}”
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {selected ? (
        <div className="border-t border-[var(--rd-line)] bg-[var(--rd-mist)] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rd-forest)]">
            Bound to a real charge
          </p>
          <p className="mt-3 text-xl font-bold text-[var(--rd-ink)]">
            {selected.authorName}
          </p>
          {selected.authorTitle ? (
            <p className="text-sm text-[var(--rd-muted)]">{selected.authorTitle}</p>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-[var(--rd-ink)]">
            “{selected.body}”
          </p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--rd-muted)]">Provider</dt>
              <dd className="font-semibold capitalize">{selected.provider}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--rd-muted)]">Order</dt>
              <dd className="font-mono text-xs">#{selected.orderRef}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--rd-muted)]">Charged</dt>
              <dd className="font-semibold">
                {formatMoney(selected.amountCents, selected.currency)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-[var(--rd-muted)]">
            A screenshot can copy the words. It cannot copy this charge. If the
            payment is not in {brand.name}&apos;s Stripe or Paddle graph, the
            quote never publishes.
          </p>
          <Link
            href={`/proof/${brand.slug}`}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--rd-forest)] hover:underline"
          >
            Open the live proof wall <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
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
    <div className="grid lg:grid-cols-2">
      <div className="flex items-center justify-center bg-gradient-to-b from-[#1a120c] to-[#3a2618] p-10">
        <div className="flex h-56 w-28 flex-col items-center justify-end rounded-full border border-white/10 bg-gradient-to-b from-[#c4a484] to-[#6b4423] pb-5">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/90">
            {brand.name}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <p className="text-sm text-amber-600">★★★★★ {reviews.length} verified reviews</p>
        <h3 className="text-2xl font-bold tracking-tight">House Cold Brew · 32oz</h3>
        <p className="text-sm text-[var(--rd-muted)]">
          {brand.tagline ?? "The bottle buyers can trust — because the reviews are payment-bound."}
        </p>
        <TrustInlineBadge
          provider={brand.paymentProvider === "paddle" ? "Paddle" : "Stripe"}
        />
        <p className="text-3xl font-bold">{featured ? formatMoney(featured.amountCents, featured.currency) : "$28"}</p>
        <div className="rounded-lg border border-[var(--rd-line)] bg-[var(--rd-mist)] p-3">
          {featured ? (
            <>
              <p className="text-sm font-semibold">{featured.authorName}</p>
              <p className="mt-1 line-clamp-3 text-xs text-[var(--rd-muted)]">
                “{featured.body}”
              </p>
              <div className="mt-2">
                <PaidVerifiedBadge
                  provider={featured.provider}
                  orderRef={featured.orderRef}
                />
              </div>
            </>
          ) : null}
        </div>
        <Link
          href="/badge-demo"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--rd-forest)] hover:underline"
        >
          Open the full storefront demo <ArrowUpRight className="h-3.5 w-3.5" />
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
    <div className="grid lg:grid-cols-[1fr_1fr]">
      <div className="space-y-2 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rd-muted)]">
          Impersonation queue
        </p>
        <ul className="mt-2 space-y-2">
          {threats.map((threat) => {
            const active = selected?.id === threat.id;
            return (
              <li key={threat.id}>
                <button
                  type="button"
                  onClick={() => onSelect(threat.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-all duration-300",
                    active
                      ? "border-[var(--rd-danger)]/40 bg-red-50/70"
                      : "border-[var(--rd-line)] hover:border-[var(--rd-danger)]/30",
                  )}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--rd-ink)]">
                      {threat.title}
                    </span>
                    <Badge
                      variant={
                        threat.severity === "critical" ? "danger" : "warn"
                      }
                    >
                      {threatLabel(threat)}
                    </Badge>
                  </span>
                  {threat.url ? (
                    <span className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[var(--rd-muted)]">
                      <Globe className="h-3 w-3" />
                      {threat.url.replace(/^https?:\/\//, "")}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {selected ? (
        <div className="border-t border-[var(--rd-line)] bg-[var(--rd-mist)] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-[var(--rd-danger)]">
            <TriangleAlert className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">
              {selected.type.replaceAll("_", " ")}
            </p>
          </div>
          <p className="mt-3 text-lg font-bold text-[var(--rd-ink)]">
            {selected.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--rd-muted)]">
            {selected.summary}
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Match the domain against the real brand graph",
              "Flag quotes with no matching Stripe/Paddle charge",
              "Pack WHOIS, screenshots, and stolen creatives",
              "Queue registrar, host, and ads-library notices",
            ].map((step) => (
              <li key={step} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rd-forest)]" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-5" size="sm">
            <Link href="/login">
              Open this threat in the console
              <ShieldAlert className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 text-sm text-[var(--rd-muted)]">
          No open threats in the demo brand.
        </div>
      )}
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

  return (
    <div
      className="rd-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
            Live product
          </p>
          <p className="mt-1 text-sm text-[var(--rd-muted)]">
            This is the real Acme Brew Co. demo — same walls, badges, and
            threats as the app.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Product surfaces"
          className="flex flex-wrap gap-1 rounded-xl border border-[var(--rd-line)] bg-white p-1"
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
                  "rounded-lg px-3 py-2 text-left transition-colors duration-200",
                  selected
                    ? "bg-[var(--rd-forest)] text-white"
                    : "text-[var(--rd-muted)] hover:bg-[var(--rd-mist)] hover:text-[var(--rd-ink)]",
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={cn(
                    "block text-[11px]",
                    selected ? "text-white/80" : "text-[var(--rd-muted)]",
                  )}
                >
                  {item.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <BrowserChrome
        url={
          tab === "proof"
            ? `receiptdoppel.demo/proof/${brand.slug}`
            : tab === "badge"
              ? `acmebrewco.com/products/cold-brew`
              : `receiptdoppel.demo/app/threats`
        }
      >
        <div
          role="tabpanel"
          id={`${tabId}-panel`}
          aria-labelledby={`${tabId}-${tab}`}
          className="rd-stage-panel"
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
        <div className="h-1 bg-[var(--rd-line)]">
          <div
            className="h-full bg-[var(--rd-forest)] transition-[width] duration-100 ease-linear"
            style={{ width: `${paused ? 0 : progress}%` }}
          />
        </div>
      </BrowserChrome>
    </div>
  );
}
