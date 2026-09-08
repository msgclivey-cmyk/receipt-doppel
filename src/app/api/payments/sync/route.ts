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

    return NextResponse.json({
      ok: true,
      brand,
      message: `Connected ${provider} account ${accountId}. Record a paid order in the console to send a review invite.`,
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
