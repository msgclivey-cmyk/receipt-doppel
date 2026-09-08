import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brandSlug = searchParams.get("brandSlug");
  const published = searchParams.get("published");
  const category = searchParams.get("category");

  if (brandSlug) {
    const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
    const testimonials = await prisma.testimonial.findMany({
      where: {
        brandId: brand.id,
        ...(published === "true" ? { published: true } : {}),
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ brand, testimonials });
  }

  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const testimonials = await prisma.testimonial.findMany({
    where: { brandId: ctx.brand.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ testimonials });
}

export async function PATCH(req: Request) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const existing = await prisma.testimonial.findFirst({
      where: { id, brandId: ctx.brand.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(typeof body.published === "boolean"
          ? { published: body.published }
          : {}),
        ...(typeof body.body === "string" ? { body: body.body } : {}),
      },
    });
    return NextResponse.json({ testimonial: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
