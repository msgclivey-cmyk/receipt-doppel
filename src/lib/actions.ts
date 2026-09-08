"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error?: string };

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password are required." };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { brands: { take: 1 } },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  const brand = user.brands[0];
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    brandId: brand?.id,
    brandSlug: brand?.slug,
  });
  redirect("/app");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const brandName = String(formData.get("brandName") || "").trim();
  if (!email || !password || !name || !brandName) {
    return { error: "Name, brand, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
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
            .map((w) => w[0])
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
  redirect("/app");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
