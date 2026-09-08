import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const ctx = await requireUser();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
    },
    brand: ctx.brand,
  });
}
