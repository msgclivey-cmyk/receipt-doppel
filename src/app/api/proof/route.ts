import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }
  const category = searchParams.get("category");
  const testimonials = await prisma.testimonial.findMany({
    where: {
      brandId: brand.id,
      published: true,
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  const verified = testimonials.length;
  return NextResponse.json({
    brand: {
      name: brand.name,
      slug: brand.slug,
      domain: brand.domain,
      paymentProvider: brand.paymentProvider,
      paymentConnected: brand.paymentConnected,
      protectionActive: brand.protectionActive,
      industry: brand.industry,
    },
    stats: {
      verified,
      disputed: 0,
    },
    testimonials,
  });
}
