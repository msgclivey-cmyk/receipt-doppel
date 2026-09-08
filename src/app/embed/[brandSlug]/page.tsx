import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PaidVerifiedBadge } from "@/components/proof/badges";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) notFound();

  const testimonials = await prisma.testimonial.findMany({
    where: { brandId: brand.id, published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-white p-4">
      <p className="mb-4 text-sm font-semibold text-[var(--rd-forest)]">
        {brand.name} · Verified proof
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm font-semibold">{t.authorName}</p>
              <p className="text-sm text-[var(--rd-muted)]">&ldquo;{t.body}&rdquo;</p>
              <PaidVerifiedBadge provider={t.provider} orderRef={t.orderRef} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
