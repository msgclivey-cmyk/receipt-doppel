import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  chargeAllowsReview,
  chargeReviewTooSoon,
  issueInvite,
  REVIEW_EMAIL_COOLDOWN_MS,
} from "@/lib/reviews";
import { reviewAskMailto, sendReviewAskEmail } from "@/lib/review-email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let force = false;
  try {
    const body = await req.json();
    force = Boolean(body?.force);
  } catch {
    force = false;
  }

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

  const tooSoon = chargeReviewTooSoon(charge);
  if (tooSoon && !force) {
    return NextResponse.json(
      {
        error: tooSoon,
        askAfterAt: charge.askAfterAt.toISOString(),
        canForce: true,
      },
      { status: 409 },
    );
  }

  if (
    charge.lastReviewEmailAt &&
    Date.now() - charge.lastReviewEmailAt.getTime() < REVIEW_EMAIL_COOLDOWN_MS
  ) {
    return NextResponse.json(
      {
        error:
          "Already asked this buyer in the last 7 days. We do not chase them.",
      },
      { status: 429 },
    );
  }

  if (tooSoon && force) {
    await prisma.charge.update({
      where: { id: charge.id },
      data: { askAfterAt: new Date() },
    });
  }

  const { url } = await issueInvite(charge.id, ctx.brand.id);
  const mailed = await sendReviewAskEmail({
    to: charge.customerEmail,
    brandName: ctx.brand.name,
    customerName: charge.customerName,
    orderRef: charge.orderRef,
    url,
  });

  if (mailed.emailed) {
    await prisma.charge.update({
      where: { id: charge.id },
      data: { lastReviewEmailAt: new Date() },
    });
  }

  return NextResponse.json({
    ok: true,
    inviteUrl: url,
    emailed: mailed.emailed,
    emailError: mailed.error ?? null,
    mailto: reviewAskMailto({
      email: charge.customerEmail,
      brandName: ctx.brand.name,
      customerName: charge.customerName,
      orderRef: charge.orderRef,
      url,
    }),
  });
}
