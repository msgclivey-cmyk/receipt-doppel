import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Shield } from "lucide-react";
import { prisma } from "@/lib/db";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PaidVerifiedBadge } from "@/components/proof/badges";
import { ProofFilters } from "@/components/proof/proof-filters";

export const dynamic = "force-dynamic";

export default async function ProofWallPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandSlug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { brandSlug } = await params;
  const { category = "all" } = await searchParams;

  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) notFound();

  const testimonials = await prisma.testimonial.findMany({
    where: {
      brandId: brand.id,
      published: true,
      ...(category !== "all" ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--rd-line)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--rd-ink)] md:flex">
            <Link
              href={`/proof/${brand.slug}`}
              className="border-b-2 border-[var(--rd-forest)] pb-0.5 text-[var(--rd-forest)]"
            >
              Proof Wall
            </Link>
            <Link href="/app" className="hover:text-[var(--rd-forest)]">
              Brand Protection
            </Link>
            <Link href="/app/settings" className="hover:text-[var(--rd-forest)]">
              Settings
            </Link>
          </nav>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--rd-mint)] text-xs font-bold text-[var(--rd-forest)]">
            {brand.logoInitials}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-4xl">
              Customer proof
            </h1>
            <p className="mt-2 text-[var(--rd-muted)]">
              Every review below is bound to a real Stripe or Paddle payment for{" "}
              <span className="font-semibold text-[var(--rd-ink)]">{brand.name}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--rd-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[var(--rd-forest)]" />
                {testimonials.length} verified testimonials
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[var(--rd-forest)]" />
                0 disputed
              </span>
              <span>
                Connected:{" "}
                {brand.paymentConnected
                  ? brand.paymentProvider === "paddle"
                    ? "Paddle"
                    : "Stripe"
                  : "Not connected"}
              </span>
            </div>
          </div>
          <ProofFilters brandSlug={brand.slug} category={category} />
        </div>
        <p className="mt-4 text-sm text-[var(--rd-muted)]">
          Paid this brand and lost the thank-you page?{" "}
          <Link
            href={`/review/find/${brand.slug}`}
            className="font-semibold text-[var(--rd-forest)] hover:underline"
          >
            Look up your order
          </Link>
          .
        </p>

        {testimonials.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-16 text-center">
              <p className="text-lg font-semibold text-[var(--rd-ink)]">
                No published testimonials yet
              </p>
              <p className="mt-2 text-sm text-[var(--rd-muted)]">
                Connect payments and publish reviews from the brand console.
              </p>
              <Link
                href="/app"
                className="mt-4 inline-block text-sm font-semibold text-[var(--rd-forest)]"
              >
                Open brand console →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rd-mint)] text-sm font-bold text-[var(--rd-forest)]">
                      {t.authorInitials}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--rd-ink)]">
                        {t.authorName}
                      </p>
                      {t.authorTitle ? (
                        <p className="text-xs text-[var(--rd-muted)]">
                          {t.authorTitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--rd-ink)]">
                    &ldquo;{t.body}&rdquo;
                  </p>
                  <div className="space-y-2 border-t border-[var(--rd-line)] pt-3">
                    <PaidVerifiedBadge
                      provider={t.provider}
                      orderRef={t.orderRef}
                    />
                    {t.brandSafe ? (
                      <Badge variant="muted">Brand not impersonated</Badge>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
