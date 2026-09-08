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
