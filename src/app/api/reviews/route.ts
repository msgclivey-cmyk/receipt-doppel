import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  chargeAllowsReview,
  chargeReviewTooSoon,
  findInviteByToken,
  initialsFromName,
  inviteBlockReason,
  issueInvite,
  maskEmail,
} from "@/lib/reviews";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token || "").trim();
    const authorName = String(body.authorName || "").trim();
    const authorTitle = String(body.authorTitle || "").trim() || null;
    const reviewBody = String(body.body || "").trim();
    const rating = Number(body.rating || 5);

    if (!token) {
      return NextResponse.json({ error: "Missing review token." }, { status: 400 });
    }
    if (authorName.length < 2 || reviewBody.length < 12) {
      return NextResponse.json(
        { error: "Add your name and a review of at least a sentence." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5." }, { status: 400 });
    }

    const invite = await findInviteByToken(token);
    const blocked = inviteBlockReason(invite);
    if (!invite || blocked) {
      return NextResponse.json({ error: blocked || "Invalid link." }, { status: 409 });
    }

    const charge = invite.charge;
    const testimonial = await prisma.$transaction(async (tx) => {
      const locked = await tx.reviewInvite.findUnique({
        where: { id: invite.id },
      });
      if (!locked || locked.usedAt) {
        throw new Error("used");
      }
      const created = await tx.testimonial.create({
        data: {
          brandId: invite.brandId,
          chargeId: charge.id,
          authorName,
          authorTitle,
          authorInitials: initialsFromName(authorName),
          authorEmailMask: maskEmail(charge.customerEmail),
          body: reviewBody,
          rating: Math.round(rating),
          amountCents: charge.amountCents,
          currency: charge.currency,
          provider: charge.provider,
          orderRef: charge.orderRef,
          published: false,
          brandSafe: true,
          category: invite.brand.industry,
        },
      });
      await tx.reviewInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      });
      return created;
    });

    return NextResponse.json({
      ok: true,
      testimonial: { id: testimonial.id, published: testimonial.published },
    });
  } catch (error) {
    if (String(error).includes("used")) {
      return NextResponse.json(
        { error: "This review was already submitted." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not save the review." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const brandSlug = String(body.brandSlug || "").trim().toLowerCase();
    const customerEmail = String(body.customerEmail || "")
      .trim()
      .toLowerCase();
    const orderRef = String(body.orderRef || "").replace(/\s+/g, "");
    if (!brandSlug || !customerEmail.includes("@") || !orderRef) {
      return NextResponse.json(
        { error: "Brand, email, and order number are required." },
        { status: 400 },
      );
    }
    const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }
    const charge = await prisma.charge.findFirst({
      where: {
        brandId: brand.id,
        orderRef,
        customerEmail,
      },
      include: { testimonial: true },
    });
    if (!charge) {
      return NextResponse.json(
        { error: "No paid order matches that email and order number." },
        { status: 404 },
      );
    }
    const blocked =
      chargeAllowsReview(charge) || chargeReviewTooSoon(charge);
    if (blocked) {
      return NextResponse.json({ error: blocked }, { status: 409 });
    }
    const { url } = await issueInvite(charge.id, brand.id);
    return NextResponse.json({ ok: true, inviteUrl: url });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}
