import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const provider = String(body.provider || "stripe").toLowerCase();
    if (!["stripe", "paddle"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const accountId = `acct_demo_${provider}_${ctx.brand.slug}`;
    const brand = await prisma.brand.update({
      where: { id: ctx.brand.id },
      data: {
        paymentProvider: provider,
        paymentConnected: true,
        paymentAccountId: accountId,
      },
    });

    // Demo sync: attach a fresh payment-bound testimonial if none recent
    const recent = await prisma.testimonial.count({
      where: {
        brandId: brand.id,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });

    let imported = 0;
    if (recent === 0) {
      const orderRef = String(Math.floor(40000 + Math.random() * 20000));
      await prisma.testimonial.create({
        data: {
          brandId: brand.id,
          authorName: "Synced Customer",
          authorTitle: "Verified buyer",
          authorInitials: "SC",
          authorEmailMask: "s***@buyer.demo",
          body: `Demo ${provider} sync imported this payment-bound review for ${brand.name}.`,
          rating: 5,
          amountCents: provider === "stripe" ? 4900 : 7900,
          provider,
          orderRef,
          published: false,
          brandSafe: true,
          category: brand.industry,
        },
      });
      imported = 1;
    }

    return NextResponse.json({
      ok: true,
      brand,
      imported,
      message: `Connected demo ${provider} account ${accountId}. Synced ${imported} payment(s).`,
    });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const brand = await prisma.brand.update({
    where: { id: ctx.brand.id },
    data: {
      paymentConnected: false,
      paymentProvider: null,
      paymentAccountId: null,
    },
  });
  return NextResponse.json({ ok: true, brand });
}
