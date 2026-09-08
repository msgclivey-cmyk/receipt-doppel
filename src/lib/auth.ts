import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "rd_session";
const secret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET || "receipt-doppel-demo-secret-change-in-prod",
  );

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  brandId?: string;
  brandSlug?: string;
};

export function publicUser(user: { id: string; email: string; name: string }) {
  return { id: user.id, email: user.email, name: user.name };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    brandId: user.brandId,
    brandSlug: user.brandSlug,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const id = payload.sub;
    if (!id) return null;
    return {
      id,
      email: String(payload.email || ""),
      name: String(payload.name || ""),
      brandId: payload.brandId ? String(payload.brandId) : undefined,
      brandSlug: payload.brandSlug ? String(payload.brandSlug) : undefined,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { brands: { take: 1 } },
  });
  if (!user) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return { session, user: safeUser, brand: user.brands[0] ?? null };
}
