export type LandingReview = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorTitle: string | null;
  body: string;
  provider: string;
  orderRef: string;
  amountCents: number;
  currency: string;
};

export type LandingThreat = {
  id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  url: string | null;
  summary: string;
};

export type LandingBrand = {
  name: string;
  slug: string;
  domain: string;
  tagline: string | null;
  paymentProvider: string | null;
  paymentConnected: boolean;
  logoInitials: string;
};

export type LandingDemo = {
  brand: LandingBrand;
  reviews: LandingReview[];
  threats: LandingThreat[];
  verifiedCount: number;
};

export function paymentProviderLabel(provider: string | null | undefined) {
  return provider?.toLowerCase() === "paddle" ? "Paddle" : "Stripe";
}

export function threatSeverityLabel(severity: string) {
  if (severity === "critical") return "Critical";
  if (severity === "high") return "High";
  if (severity === "medium") return "Medium";
  if (severity === "low") return "Low";
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function threatTypeLabel(type: string) {
  return type.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
