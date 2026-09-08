import { notFound } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewLookupForm } from "@/components/reviews/review-lookup-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FindReviewPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) notFound();

  return (
    <div className="rd-grid-bg min-h-screen px-4 py-12">
      <div className="mx-auto max-w-lg space-y-6">
        <BrandMark className="justify-center" href={`/proof/${brand.slug}`} />
        <Card>
          <CardHeader>
            <CardTitle>Lost the review email?</CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              Use the email and order number from your receipt. If they match a
              paid charge that is ready, the same one-sentence form opens. Too
              soon, or no match — no form.
            </p>
          </CardHeader>
          <CardContent>
            <ReviewLookupForm brandSlug={brand.slug} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
