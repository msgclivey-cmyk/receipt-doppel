"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProofFilters({
  brandSlug,
  category,
}: {
  brandSlug: string;
  category: string;
}) {
  const router = useRouter();
  const tabs = [
    { id: "all", label: "All" },
    { id: "SaaS", label: "SaaS" },
    { id: "DTC", label: "DTC" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-lg border border-[var(--rd-line)] p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/proof/${brandSlug}?category=${t.id}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-semibold",
              category === t.id
                ? "border border-[var(--rd-forest)] text-[var(--rd-forest)]"
                : "text-[var(--rd-muted)] hover:text-[var(--rd-ink)]",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <select
        className="h-9 rounded-md border border-[var(--rd-line)] bg-white px-3 text-sm"
        defaultValue="30"
        onChange={() => router.refresh()}
        aria-label="Date range"
      >
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="all">All time</option>
      </select>
    </div>
  );
}
