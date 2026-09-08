import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { chargeAllowsReview, issueInvite } from "@/lib/reviews";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const charge = await prisma.charge.findFirst({
    where: { id, brandId: ctx.brand.id },
    include: { testimonial: true },
  });
  if (!charge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const blocked = chargeAllowsReview(charge);
  if (blocked) {
    return NextResponse.json({ error: blocked }, { status: 409 });
  }
  const { url } = await issueInvite(charge.id, ctx.brand.id);
  return NextResponse.json({ ok: true, inviteUrl: url });
}
