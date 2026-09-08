import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { brands: { take: 1 } },
    });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    const brand = user.brands[0];
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      brandId: brand?.id,
      brandSlug: brand?.slug,
    });
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
      brand,
    });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
