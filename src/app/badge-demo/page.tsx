import Link from "next/link";
import { prisma } from "@/lib/db";
import { TrustInlineBadge, PaidVerifiedBadge } from "@/components/proof/badges";

export const dynamic = "force-dynamic";

export default async function BadgeDemoPage() {
  const brand = await prisma.brand.findUnique({ where: { slug: "acme-brew" } });
  const reviews = brand
    ? await prisma.testimonial.findMany({
        where: { brandId: brand.id, published: true },
        take: 2,
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--rd-line)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <p className="text-lg font-bold tracking-wide">ACME BREW CO.</p>
          <nav className="hidden gap-6 text-sm font-medium text-[var(--rd-muted)] sm:flex">
            <span>SHOP</span>
            <span>SUBSCRIBE &amp; SAVE</span>
            <span>ABOUT</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#1a120c] to-[#3a2618] p-12">
          <div className="flex h-64 w-32 flex-col items-center justify-end rounded-full border border-white/10 bg-gradient-to-b from-[#c4a484] to-[#6b4423] pb-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-white">
              Acme Brew Co.
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-sm text-amber-600">★★★★★ 128 verified reviews</p>
          <h1 className="text-3xl font-bold tracking-tight">
            House Cold Brew · 32oz
          </h1>
          <p className="text-[var(--rd-muted)]">
            Slow-steeped specialty beans. No additives. The bottle buyers can
            trust — because the reviews are payment-bound.
          </p>
          <TrustInlineBadge provider="Stripe" />
          <p className="text-xs text-[var(--rd-muted)]">
            Tooltip: This review is bound to a real payment.
          </p>
          <p className="text-3xl font-bold">$28.00</p>
          <button className="w-full rounded-md bg-[var(--rd-ink)] py-3 text-sm font-bold uppercase tracking-wide text-white">
            Add to cart
          </button>
          <Link
            href="/proof/acme-brew"
            className="inline-block text-sm font-semibold text-[var(--rd-forest)]"
          >
            See full proof wall →
          </Link>
        </div>
      </main>

      <section className="mx-auto max-w-5xl border-t border-[var(--rd-line)] px-4 py-12">
        <h2 className="text-xl font-bold">What buyers say</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-[var(--rd-line)] bg-[var(--rd-mist)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold">
                  {r.authorInitials}
                </div>
                <div>
                  <p className="font-semibold">{r.authorName}</p>
                  <p className="text-xs text-[var(--rd-muted)]">Verified buyer</p>
                </div>
              </div>
              <p className="mt-3 text-sm">&ldquo;{r.body}&rdquo;</p>
              <div className="mt-3">
                <PaidVerifiedBadge />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
