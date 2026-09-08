import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

export const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const MS_DAY = 1000 * 60 * 60 * 24;
export const REVIEW_EMAIL_COOLDOWN_MS = MS_DAY * 7;

export function clampAskAfterDays(days: unknown) {
  const n = Number(days);
  if (!Number.isFinite(n)) return 7;
  return Math.max(0, Math.min(90, Math.round(n)));
}

export function computeAskAfterAt(paidAt: Date, days: number) {
  return new Date(paidAt.getTime() + clampAskAfterDays(days) * MS_DAY);
}

export function reviewNotOpenYet(askAfterAt: Date) {
  return askAfterAt.getTime() > Date.now();
}

export function daysUntil(date: Date) {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / MS_DAY));
}

export function appBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:4317").replace(
    /\/$/,
    "",
  );
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function maskEmail(email: string) {
  const [user, domain] = email.trim().toLowerCase().split("@");
  if (!user || !domain) return "***";
  return `${user[0]}***@${domain}`;
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function inviteUrl(token: string) {
  return `${appBaseUrl()}/review/${token}`;
}

export async function issueInvite(chargeId: string, brandId: string) {
  await prisma.reviewInvite.updateMany({
    where: { chargeId, usedAt: null },
    data: { expiresAt: new Date() },
  });
  const token = newInviteToken();
  const invite = await prisma.reviewInvite.create({
    data: {
      brandId,
      chargeId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + INVITE_TTL_MS),
    },
  });
  return { invite, token, url: inviteUrl(token) };
}

export function chargeAllowsReview(charge: {
  status: string;
  testimonial?: { id: string } | null;
}) {
  if (charge.status !== "paid") {
    return "This order is refunded or disputed, so it cannot collect a review.";
  }
  if (charge.testimonial) {
    return "This order already has a review.";
  }
  return null;
}

export function chargeReviewTooSoon(charge: { askAfterAt: Date }) {
  if (!reviewNotOpenYet(charge.askAfterAt)) return null;
  const days = daysUntil(charge.askAfterAt);
  return days <= 1
    ? "This review is not open yet. A quote before you have used the product is not useful."
    : `This review opens in about ${days} days — after you have had time with the order.`;
}

export async function findInviteByToken(token: string) {
  const invite = await prisma.reviewInvite.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      brand: true,
      charge: { include: { testimonial: true } },
    },
  });
  return invite;
}

export function inviteBlockReason(
  invite: Awaited<ReturnType<typeof findInviteByToken>>,
) {
  if (!invite) return "This review link is invalid.";
  if (invite.usedAt) return "This review was already submitted.";
  if (invite.expiresAt.getTime() < Date.now()) {
    return "This review link has expired. Ask the brand for a new one, or look up your order.";
  }
  return (
    chargeReviewTooSoon(invite.charge) || chargeAllowsReview(invite.charge)
  );
}
