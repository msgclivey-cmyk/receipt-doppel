import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShieldLogo } from "@/components/brand-mark";

export function PaidVerifiedBadge({
  provider,
  orderRef,
  className,
}: {
  provider?: string;
  orderRef?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rd-forest)]/30 bg-[var(--rd-mint)] px-2.5 py-1 text-xs font-semibold text-[var(--rd-forest)]">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
        Paid &amp; verified
      </div>
      {provider && orderRef ? (
        <p className="text-xs text-[var(--rd-muted)]">
          {provider === "stripe" ? "Stripe" : "Paddle"} · Order #{orderRef}
        </p>
      ) : null}
    </div>
  );
}

export function TrustInlineBadge({
  provider = "Stripe",
  className,
}: {
  provider?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-[var(--rd-forest)]/35 bg-white px-3 py-2.5 shadow-sm",
        className,
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rd-forest)] text-white">
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--rd-forest)]">
          Paid customer · Brand not impersonated
        </p>
        <p className="text-xs text-[var(--rd-muted)]">Verified via {provider}</p>
      </div>
      <div className="hidden items-center gap-1 border-l border-[var(--rd-line)] pl-3 sm:flex">
        <ShieldLogo size={16} className="text-[var(--rd-forest)]" />
        <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--rd-forest)]">
          Receipt Doppel
        </span>
      </div>
    </div>
  );
}
