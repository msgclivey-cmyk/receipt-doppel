import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword, publicUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const brandName = String(body.brandName || "").trim();
    if (!email || !password || !name || !brandName) {
      return NextResponse.json(
        { error: "Name, brand, email, and password are required." },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    const slugBase = brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);
    let slug = slugBase || "brand";
    let i = 1;
    while (await prisma.brand.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i++}`;
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        brands: {
          create: {
            name: brandName,
            slug,
            domain: `${slug}.example`,
            industry: "SaaS",
            logoInitials: brandName
              .split(/\s+/)
              .map((w: string) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            paymentConnected: false,
            protectionActive: true,
          },
        },
      },
      include: { brands: true },
    });
    const brand = user.brands[0];
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      brandId: brand.id,
      brandSlug: brand.slug,
    });
    return NextResponse.json({
      ok: true,
      user: publicUser(user),
      brand,
    });
  } catch {
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
