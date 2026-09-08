import Link from "next/link";
import {
  ArrowRight,
  Check,
  Globe,
  Link2,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { BrandMark, ShieldLogo } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrustInlineBadge, PaidVerifiedBadge } from "@/components/proof/badges";

const logos = ["ACME BREW CO.", "Loomly", "NORTHLINE", "paddle", "VERO", "peak"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="rd-shield-wash relative overflow-hidden border-b border-[var(--rd-line)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="rd-fade-up">
            <ShieldLogo size={56} className="mb-5 text-[var(--rd-forest)]" />
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight text-[var(--rd-forest)] sm:text-6xl">
              Receipt Doppel
            </h1>
            <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-3xl">
              Proof that paid. Protection that takes down fakes.
            </p>
            <p className="mt-4 max-w-md text-base text-[var(--rd-muted)] sm:text-lg">
              Payment-bound testimonials and brand impersonation defense in one
              trust product.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Start free proof wall</Link>
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--rd-forest)] hover:underline"
              >
                See how it works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rd-fade-up-delay relative mx-auto w-full max-w-md">
            <div className="rd-float absolute -right-2 top-0 z-20 w-[85%] sm:right-0">
              <TrustInlineBadge provider="Stripe" />
            </div>
            <div className="relative mt-16 overflow-hidden rounded-2xl border border-[var(--rd-line)] bg-gradient-to-b from-[#1a120c] to-[#3a2618] p-8 shadow-xl">
              <div className="mx-auto flex h-56 w-28 flex-col items-center justify-end rounded-full border border-white/10 bg-gradient-to-b from-[#c4a484] to-[#6b4423] pb-4 shadow-inner">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/90">
                  Acme
                  <br />
                  Brew Co.
                </p>
                <p className="mt-1 text-[9px] text-white/60">Cold Brew</p>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(11,92,69,0.25),transparent_45%)]" />
            </div>
            <Card className="rd-float absolute -left-2 bottom-24 z-10 w-[78%] border-[var(--rd-line)] sm:left-0" style={{ animationDelay: "0.6s" }}>
              <CardContent className="space-y-2 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--rd-muted)]">
                  Fake lookalike domain
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-[var(--rd-muted)]" />
                  <span className="font-mono text-xs">acmebrewc0.com</span>
                  <Badge variant="muted">Detected</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--rd-danger)]">
                  <TriangleAlert className="h-3.5 w-3.5" />
                  High risk impersonation
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -right-1 bottom-2 z-20 w-[82%] border-[var(--rd-forest)]/30 sm:right-2">
              <CardContent className="space-y-2 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--rd-forest)]">
                  Verified receipt match
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[var(--rd-forest)]" />
                  <span className="font-mono text-xs">acmebrewco.com</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <p className="text-xs text-[var(--rd-muted)]">
                  Real brand. Real payments. Real customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social proof / before-after */}
      <section className="rd-grid-bg border-b border-[var(--rd-line)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rd-muted)]">
            Trusted by DTC &amp; SaaS brands
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold tracking-wide text-[var(--rd-muted)]/80">
            {logos.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ShieldLogo
              size={28}
              className="mx-auto mb-3 text-[var(--rd-forest)]"
            />
            <h2 className="text-3xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-4xl">
              Paid &amp; not impersonated.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--rd-muted)]">
              Before Receipt Doppel, buyers saw screenshots. After, they see
              payment-bound proof—and fakes get taken down.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">BEFORE</Badge>
                  <span className="text-sm font-semibold">Fake review site</span>
                  <Badge variant="danger">
                    <TriangleAlert className="h-3 w-3" /> Critical impersonation
                  </Badge>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <span className="font-mono">acme-brew-deals.com</span>
                    <Badge variant="danger">Lookalike domain</Badge>
                  </div>
                  {[
                    ["Jessica M.", "Worst cold brew ever."],
                    ["Daniel K.", "Shipping took forever."],
                    ["Sarah T.", "Looks fake to me."],
                  ].map(([name, body]) => (
                    <div
                      key={name}
                      className="mb-2 flex items-start justify-between gap-2 border-b border-red-100 pb-2 last:mb-0 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-xs text-[var(--rd-muted)]">{body}</p>
                      </div>
                      <Badge variant="danger" className="shrink-0">
                        Not in payment graph
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-[var(--rd-danger)]">
                  Screenshots can be faked. Lookalike domains mislead buyers.
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rd-forest)] text-white shadow">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>

            <Card className="overflow-hidden border-[var(--rd-forest)]/25">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>AFTER</Badge>
                  <span className="text-sm font-semibold">
                    Receipt Doppel Proof Wall
                  </span>
                  <Badge variant="outline">Protected</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[var(--rd-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-[var(--rd-forest)]" />
                    128 verified testimonials
                  </span>
                  <span>0 disputed</span>
                  <span>Connected: Stripe</span>
                </div>
                {[
                  ["Casey M.", "CM", "Bold, clean cold brew — and every review is tied to a real order."],
                  ["Jordan T.", "JT", "The proof wall made it obvious they weren't faking reviews."],
                  ["Sara R.", "SR", "The trust badge on their site sealed the subscription."],
                ].map(([name, initials, body]) => (
                  <div
                    key={name}
                    className="flex items-start gap-3 border-b border-[var(--rd-line)] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--rd-mint)] text-xs font-bold text-[var(--rd-forest)]">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-[var(--rd-muted)]">{body}</p>
                    </div>
                    <div className="hidden shrink-0 flex-col gap-1 sm:flex">
                      <PaidVerifiedBadge />
                      <Badge variant="muted">Brand not impersonated</Badge>
                    </div>
                  </div>
                ))}
                <div className="rounded-md bg-[var(--rd-mint)] px-3 py-2 text-xs text-[var(--rd-forest)]">
                  Every review is payment-bound. Real customers. Real protection.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="rd-grid-bg py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <BrandMark className="mx-auto justify-center" href="/#how-it-works" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-4xl">
              How Receipt Doppel works
            </h2>
            <p className="mt-3 text-[var(--rd-muted)]">
              From real payments to public proof to impersonation takedowns.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Connect payments",
                body: "Connect Stripe or Paddle so every review binds to a real charge.",
                icon: (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="rounded bg-[#635bff] px-2 py-1 text-white">
                      Stripe
                    </span>
                    <Link2 className="h-4 w-4 text-[var(--rd-forest)]" />
                    <span className="rounded bg-[#002c6d] px-2 py-1 text-white">
                      Paddle
                    </span>
                  </div>
                ),
              },
              {
                n: "2",
                title: "Publish verified proof",
                body: "Publish a proof wall buyers can trust—payment sealed, not screenshot theater.",
                icon: <PaidVerifiedBadge provider="stripe" orderRef="48291" />,
              },
              {
                n: "3",
                title: "Catch impersonators",
                body: "Detect lookalike domains, fake review farms, and stolen creatives—then launch takedowns.",
                icon: (
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-8 w-8 text-[var(--rd-danger)]" />
                    <ArrowRight className="h-4 w-4 text-[var(--rd-muted)]" />
                    <ShieldLogo size={32} className="text-[var(--rd-forest)]" />
                  </div>
                ),
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[var(--rd-line)]">
                  {step.icon}
                </div>
                <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rd-forest)] text-sm font-bold text-white">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-[var(--rd-ink)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--rd-muted)]">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-xl border border-[var(--rd-line)] bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldLogo size={28} className="text-[var(--rd-forest)]" />
              <div>
                <p className="font-bold text-[var(--rd-ink)]">
                  Real reviews. Real payments. Real protection.
                </p>
                <p className="text-sm text-[var(--rd-muted)]">
                  Receipt Doppel turns trust into a verifiable advantage.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/signup">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
