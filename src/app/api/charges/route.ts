import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { computeAskAfterAt, maskEmail } from "@/lib/reviews";

function randomOrderRef() {
  return String(Math.floor(40000 + Math.random() * 50000));
}

function serializeCharge(charge: {
  id: string;
  orderRef: string;
  amountCents: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  provider: string;
  status: string;
  askAfterAt: Date;
  lastReviewEmailAt: Date | null;
  paidAt: Date;
  testimonial: { published: boolean } | null;
  invites: { expiresAt: Date; usedAt: Date | null }[];
}) {
  return {
    id: charge.id,
    orderRef: charge.orderRef,
    amountCents: charge.amountCents,
    currency: charge.currency,
    customerName: charge.customerName,
    customerEmailMask: maskEmail(charge.customerEmail),
    provider: charge.provider,
    status: charge.status,
    hasReview: Boolean(charge.testimonial),
    reviewPublished: charge.testimonial?.published ?? null,
    askAfterAt: charge.askAfterAt.toISOString(),
    lastReviewEmailAt: charge.lastReviewEmailAt?.toISOString() ?? null,
    paidAt: charge.paidAt.toISOString(),
    ready: charge.askAfterAt.getTime() <= Date.now(),
    asked: Boolean(charge.lastReviewEmailAt) ||
      Boolean(
        charge.invites[0] &&
          !charge.invites[0].usedAt &&
          charge.invites[0].expiresAt.getTime() > Date.now(),
      ),
    inviteExpired: charge.invites[0]
      ? charge.invites[0].expiresAt.getTime() < Date.now() ||
        Boolean(charge.invites[0].usedAt)
      : true,
  };
}

export async function GET() {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const charges = await prisma.charge.findMany({
    where: { brandId: ctx.brand.id },
    include: {
      testimonial: true,
      invites: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    charges: charges.map(serializeCharge),
  });
}

export async function POST(req: Request) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ctx.brand.paymentConnected) {
    return NextResponse.json(
      { error: "Connect Stripe or Paddle in Settings before recording a paid order." },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    const customerEmail = String(body.customerEmail || "")
      .trim()
      .toLowerCase();
    const customerName = String(body.customerName || "").trim();
    const amountCents = Number(body.amountCents);
    const provider = String(
      body.provider || ctx.brand.paymentProvider || "stripe",
    ).toLowerCase();
    if (!customerEmail.includes("@") || !customerName) {
      return NextResponse.json(
        { error: "Customer name and email are required." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(amountCents) || amountCents < 100) {
      return NextResponse.json(
        { error: "Amount must be at least $1.00." },
        { status: 400 },
      );
    }
    if (!["stripe", "paddle"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const orderRef = String(body.orderRef || randomOrderRef()).replace(
      /\s+/g,
      "",
    );
    const providerChargeId = `demo_${ctx.brand.slug}_${orderRef}`;
    const paidAt = new Date();
    const askAfterAt = computeAskAfterAt(
      paidAt,
      ctx.brand.reviewAskAfterDays,
    );

    const charge = await prisma.charge.create({
      data: {
        brandId: ctx.brand.id,
        provider,
        providerChargeId,
        orderRef,
        amountCents: Math.round(amountCents),
        customerEmail,
        customerName,
        status: "paid",
        paidAt,
        askAfterAt,
      },
    });
    return NextResponse.json({
      ok: true,
      charge: serializeCharge({
        ...charge,
        testimonial: null,
        invites: [],
      }),
    });
  } catch (error) {
    const message = String(error);
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "That order number is already on file for this brand." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not record the charge." }, { status: 500 });
  }
}
