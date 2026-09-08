import { NextResponse } from "next/server";
import { publicUser, requireUser } from "@/lib/auth";

export async function GET() {
  const ctx = await requireUser();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: publicUser(ctx.user),
    brand: ctx.brand,
  });
}
