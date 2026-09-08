import { prisma } from "@/lib/db";
import { LandingHome } from "@/components/marketing/landing-home";
import type { LandingDemo } from "@/lib/landing";

export const dynamic = "force-dynamic";

async function getLandingDemo(): Promise<LandingDemo | null> {
  const brand = await prisma.brand.findUnique({ where: { slug: "acme-brew" } });
  if (!brand) return null;

  const [testimonials, threats, verifiedCount] = await Promise.all([
    prisma.testimonial.findMany({
      where: { brandId: brand.id, published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.threat.findMany({
      where: { brandId: brand.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.testimonial.count({
      where: { brandId: brand.id, published: true },
    }),
  ]);

  return {
    brand: {
      name: brand.name,
      slug: brand.slug,
      domain: brand.domain,
      tagline: brand.tagline,
      paymentProvider: brand.paymentProvider,
      paymentConnected: brand.paymentConnected,
      logoInitials: brand.logoInitials,
    },
    reviews: testimonials.map((t) => ({
      id: t.id,
      authorName: t.authorName,
      authorInitials: t.authorInitials,
      authorTitle: t.authorTitle,
      body: t.body,
      provider: t.provider,
      orderRef: t.orderRef,
      amountCents: t.amountCents,
      currency: t.currency,
    })),
    threats: threats.map((t) => ({
      id: t.id,
      title: t.title,
      type: t.type,
      severity: t.severity,
      status: t.status,
      url: t.url,
      summary: t.summary,
    })),
    verifiedCount,
  };
}

export default async function HomePage() {
  const demo = await getLandingDemo();
  return <LandingHome demo={demo} />;
}
