import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const status = String(body.status || "");
    if (!["paid", "refunded", "disputed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const existing = await prisma.charge.findFirst({
      where: { id, brandId: ctx.brand.id },
      include: { testimonial: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const charge = await prisma.charge.update({
      where: { id },
      data: { status },
    });
    if (status !== "paid" && existing.testimonial?.published) {
      await prisma.testimonial.update({
        where: { id: existing.testimonial.id },
        data: { published: false },
      });
    }
    return NextResponse.json({ charge });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
