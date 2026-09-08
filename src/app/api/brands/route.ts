import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { clampAskAfterDays } from "@/lib/reviews";

export async function PATCH(req: Request) {
  const ctx = await requireUser();
  if (!ctx?.brand) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const brand = await prisma.brand.update({
      where: { id: ctx.brand.id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.domain === "string" ? { domain: body.domain } : {}),
        ...(typeof body.tagline === "string" ? { tagline: body.tagline } : {}),
        ...(typeof body.industry === "string"
          ? { industry: body.industry }
          : {}),
        ...(typeof body.protectionActive === "boolean"
          ? { protectionActive: body.protectionActive }
          : {}),
        ...(body.reviewAskAfterDays !== undefined
          ? { reviewAskAfterDays: clampAskAfterDays(body.reviewAskAfterDays) }
          : {}),
      },
    });
    return NextResponse.json({ brand });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
