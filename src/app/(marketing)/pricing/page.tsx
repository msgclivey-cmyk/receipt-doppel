import Link from "next/link";
import { Check, Building2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { ShieldLogo } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Proof",
    price: "$49",
    period: "/mo",
    blurb: "Good",
    cta: "Choose Proof",
    href: "/signup",
    variant: "outline" as const,
    features: [
      "Payment-bound testimonials",
      "Public proof wall",
      "Paid & verified badges",
      "Basic analytics",
    ],
  },
  {
    name: "Proof + Guard",
    price: "$149",
    period: "/mo",
    blurb: "Better",
    recommended: true,
    cta: "Choose Guard",
    href: "/signup",
    variant: "default" as const,
    features: [
      "Everything in Proof, plus:",
      "Impersonation monitoring",
      "Lookalike domain alerts",
      "Evidence packs for takedowns",
      "Priority detections",
      "Advanced analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "Best",
    sub: "Tailored to your organization",
    cta: "Talk to us",
    href: "mailto:hello@receiptdoppel.demo",
    variant: "outline" as const,
    enterprise: true,
    features: [
      "Everything in Proof + Guard",
      "Dedicated takedown workflows",
      "Multi-brand management",
      "SSO & role-based access",
      "SLA & priority support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-5xl">
            Simple pricing for proof and protection.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--rd-muted)]">
            Start with verified testimonials. Add brand defense when the fakes
            show up.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.recommended
                  ? "relative border-2 border-[var(--rd-forest)] shadow-md"
                  : ""
              }
            >
              {tier.recommended ? (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  RECOMMENDED
                </Badge>
              ) : null}
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rd-mint)] text-[var(--rd-forest)]">
                  {tier.enterprise ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <ShieldLogo size={22} />
                  )}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rd-muted)]">
                  {tier.blurb}
                </p>
                <CardTitle>{tier.name}</CardTitle>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-[var(--rd-ink)]">
                    {tier.price}
                  </span>
                  <span className="text-[var(--rd-muted)]">{tier.period}</span>
                  {tier.sub ? (
                    <p className="mt-1 text-sm text-[var(--rd-muted)]">{tier.sub}</p>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rd-forest)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant={tier.variant} className="w-full">
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-xl bg-[var(--rd-mist)] p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <ShieldLogo size={28} className="text-[var(--rd-forest)]" />
            <div>
              <p className="font-bold text-[var(--rd-ink)]">
                Ship trust buyers can audit.
              </p>
              <p className="text-sm text-[var(--rd-muted)]">
                Make proof visible. Make impersonators invisible.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Button asChild>
              <Link href="/signup">Start free proof wall</Link>
            </Button>
            <p className="mt-2 text-xs text-[var(--rd-muted)]">
              ✓ No credit card required
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
