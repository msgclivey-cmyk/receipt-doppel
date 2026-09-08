import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Link2,
  ShieldAlert,
  Store,
} from "lucide-react";
import { ProductStage } from "@/components/marketing/product-stage";
import { Reveal } from "@/components/marketing/reveal";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { PaidVerifiedBadge } from "@/components/proof/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { threatSeverityLabel, type LandingDemo } from "@/lib/landing";
import { formatMoney } from "@/lib/utils";

const steps = [
  {
    n: "01",
    title: "Connect the payment graph",
    body: "Stripe or Paddle. Receipt Doppel only accepts quotes that match a real charge — provider, amount, and order ref.",
    detail:
      "No CSV of screenshots. No “trust us” imports. If the charge is not in your account, the review cannot publish.",
  },
  {
    n: "02",
    title: "Bind the quote to the receipt",
    body: "The customer’s words are sealed to that payment. The public card shows Paid & verified plus the order number.",
    detail:
      "A rival can copy the sentence. They cannot copy the charge. That is the whole product.",
  },
  {
    n: "03",
    title: "Publish the wall and the badge",
    body: "A public proof wall, an embed for your site, and a badge on the product page.",
    detail:
      "Buyers see “Paid customer · Brand not impersonated” before they add to cart — not after they get burned.",
  },
  {
    n: "04",
    title: "Hunt the lookalikes",
    body: "Guard watches cloned domains, fake review farms, and stolen ads, then queues a takedown with evidence.",
    detail:
      "WHOIS, screenshot diffs, quotes with no matching payment, registrar and ads-library notices — one console.",
  },
];

const jobs = [
  {
    icon: Store,
    title: "Payment-bound proof",
    body: "Testimonials that only exist because someone paid you. Public wall, embed, and on-page badge.",
  },
  {
    icon: FileSearch,
    title: "Fake-review detection",
    body: "1-star piles and cloned Trustpilot pages that have zero matching Stripe or Paddle charges get flagged.",
  },
  {
    icon: ShieldAlert,
    title: "Impersonation takedowns",
    body: "Lookalike domains and stolen creatives enter a queue with an evidence pack you can actually send.",
  },
];

const faqs = [
  {
    q: "How is this different from screenshots or a review widget?",
    a: "Screenshots and most widgets take anyone’s word. Receipt Doppel refuses a quote unless it matches a charge in Stripe or Paddle. The badge on the card is the receipt, not decoration.",
  },
  {
    q: "Do I have to use Stripe?",
    a: "Stripe or Paddle. The live Acme Brew Co. demo is already connected, so you can click the wall without API keys. Production uses the same flow with a real account.",
  },
  {
    q: "What does Guard actually take down?",
    a: "Lookalike domains, fake review farms, and ads using your creatives. It does not magically delete the internet. It compiles evidence and queues registrar, host, and platform notices from the console.",
  },
  {
    q: "Will buyers see this without logging in?",
    a: "Yes. The proof wall is public. The embed is a public iframe. The badge sits on your product page. The console is the only gated surface.",
  },
  {
    q: "Is this a free wall?",
    a: "No. Proof is $49/mo. Proof + Guard is $149/mo. You can click through the live Acme Brew Co. demo before you pay.",
  },
];

const tiers = [
  {
    name: "Proof",
    price: "$49",
    blurb: "Wall, badges, payment bind.",
    href: "/signup",
    cta: "Choose Proof",
  },
  {
    name: "Proof + Guard",
    price: "$149",
    blurb: "Everything in Proof, plus impersonation takedowns.",
    href: "/signup",
    cta: "Choose Guard",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "Multi-brand, SSO, dedicated workflows.",
    href: "mailto:hello@receiptdoppel.demo",
    cta: "Talk to us",
  },
];

export function LandingHome({ demo }: { demo: LandingDemo | null }) {
  const reviews = demo?.reviews ?? [];
  const threats = demo?.threats ?? [];
  const brand = demo?.brand;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
      <section className="rd-hero relative overflow-hidden border-b border-[var(--rd-line)]">
        <div className="rd-mesh" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(280px,36%)_minmax(0,1fr)] lg:gap-12 lg:py-12 xl:gap-16">
          <Reveal>
            <p className="inline-flex rounded-full border border-[var(--rd-forest)]/20 bg-[var(--rd-mint)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rd-forest)]">
              Bound to Stripe &amp; Paddle
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.15rem] font-bold leading-[1.08] tracking-tight text-[var(--rd-ink)] sm:text-5xl lg:text-[3.15rem]">
              If they didn&apos;t pay, they don&apos;t speak for your brand.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--rd-muted)] lg:text-lg">
              Receipt Doppel binds every testimonial to a real charge, puts that
              proof on your site, and hunts the fake shops using your name.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="#live-proof">
                  See a live proof wall
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-[var(--rd-muted)]">
                {brand
                  ? `Live demo · ${brand.name} · ${demo?.verifiedCount ?? reviews.length} paid reviews`
                  : "Live demo loads from the seeded brand."}
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--rd-line)] pt-5">
              {[
                [
                  String(demo?.verifiedCount ?? reviews.length),
                  "paid reviews",
                ],
                ["0", "disputed"],
                [String(threats.length), "open threats"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--rd-forest)] lg:text-3xl">
                    {n}
                  </dt>
                  <dd className="mt-0.5 text-xs text-[var(--rd-muted)]">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={80} className="min-w-0" id="live-product">
            {brand ? (
              <ProductStage brand={brand} reviews={reviews} threats={threats} />
            ) : (
              <Card>
                <CardContent className="p-8 text-sm text-[var(--rd-muted)]">
                  Seed the database to load the live Acme Brew Co. demo on this
                  page.
                </CardContent>
              </Card>
            )}
          </Reveal>
        </div>
      </section>

      <section id="what-we-do" className="border-b border-[var(--rd-line)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
              What we do
            </p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--rd-ink)]">
              Three jobs. One trust stack.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--rd-muted)]">
              Most tools either collect quotes or watch domains. Receipt Doppel
              does the job buyers actually care about: prove the review paid,
              and prove the shop is you.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {jobs.map((job, i) => (
              <Reveal key={job.title} delay={i * 80}>
                <Card className="rd-lift h-full">
                  <CardContent className="space-y-3 p-6">
                    <job.icon className="h-6 w-6 text-[var(--rd-forest)]" />
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--rd-muted)]">
                      {job.body}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="rd-grid-bg border-b border-[var(--rd-line)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
              How a quote becomes proof
            </p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
              The receipt is the review.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {steps.map((step, i) => (
              <Reveal
                key={step.n}
                as="li"
                delay={i * 70}
                className="rounded-2xl border border-[var(--rd-line)] bg-white p-6 transition-shadow duration-300 hover:shadow-md"
              >
                <p className="font-mono text-xs font-semibold text-[var(--rd-forest)]">
                  {step.n}
                </p>
                <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--rd-ink)]">
                  {step.body}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--rd-muted)]">
                  {step.detail}
                </p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--rd-line)] bg-white px-5 py-4">
              <span className="rounded bg-[#635bff] px-2 py-1 text-xs font-semibold text-white">
                Stripe
              </span>
              <Link2 className="h-4 w-4 text-[var(--rd-forest)]" />
              <span className="rounded bg-[#002c6d] px-2 py-1 text-xs font-semibold text-white">
                Paddle
              </span>
              <p className="text-sm text-[var(--rd-muted)]">
                Connect Stripe or Paddle in settings. The live demo is already
                wired so you can click through without API keys.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="live-proof" className="border-b border-[var(--rd-line)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
                Live proof wall
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
                Same wall your buyers would see.
              </h2>
              <p className="mt-3 max-w-xl text-[var(--rd-muted)]">
                These cards come from real demo charges for{" "}
                {brand?.name ?? "the demo brand"}. Open the public wall — it is
                not a screenshot.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={brand ? `/proof/${brand.slug}` : "/signup"}>
                Open the live wall
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          {reviews.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--rd-muted)]">
              No published testimonials yet. Seed the database.
            </p>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal key={review.id} delay={i * 50}>
                  <Card className="rd-lift h-full">
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rd-mint)] text-sm font-bold text-[var(--rd-forest)]">
                          {review.authorInitials}
                        </div>
                        <div>
                          <p className="font-semibold">{review.authorName}</p>
                          <p className="text-xs text-[var(--rd-muted)]">
                            {review.authorTitle ?? "Verified buyer"} ·{" "}
                            {formatMoney(review.amountCents, review.currency)}
                          </p>
                        </div>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed">
                        “{review.body}”
                      </p>
                      <div className="border-t border-[var(--rd-line)] pt-3">
                        <PaidVerifiedBadge
                          provider={review.provider}
                          orderRef={review.orderRef}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-2xl border border-[var(--rd-line)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rd-line)] bg-[var(--rd-mist)] px-4 py-3">
                <p className="text-sm font-semibold">How the embed looks on your site</p>
                {brand ? (
                  <Link
                    href={`/embed/${brand.slug}`}
                    className="text-sm font-semibold text-[var(--rd-forest)] hover:underline"
                  >
                    Open the live embed
                  </Link>
                ) : null}
              </div>
              <div className="grid gap-3 bg-white p-4 sm:grid-cols-2">
                {reviews.slice(0, 4).map((review) => (
                  <Card key={`embed-${review.id}`}>
                    <CardContent className="space-y-2 p-4">
                      <p className="text-sm font-semibold">{review.authorName}</p>
                      <p className="line-clamp-3 text-sm text-[var(--rd-muted)]">
                        “{review.body}”
                      </p>
                      <PaidVerifiedBadge
                        provider={review.provider}
                        orderRef={review.orderRef}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="guard" className="rd-grid-bg border-b border-[var(--rd-line)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
              Guard
            </p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
              Screenshots can be faked. Lookalike shops get a queue.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--rd-muted)]">
              Guard is the other half of the product. When a domain, review
              farm, or ad does not match your payment graph, it lands here with
              work to do — not a dashboard chart.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4">
            {threats.map((threat, i) => (
              <Reveal key={threat.id} delay={i * 60}>
                <Card>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[var(--rd-ink)]">
                          {threat.title}
                        </h3>
                        <Badge
                          variant={
                            threat.severity === "critical" ? "danger" : "warn"
                          }
                        >
                          {threatSeverityLabel(threat.severity)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--rd-muted)]">
                        {threat.summary}
                      </p>
                      {threat.url ? (
                        <p className="mt-2 font-mono text-xs text-[var(--rd-muted)]">
                          {threat.url.replace(/^https?:\/\//, "")}
                        </p>
                      ) : null}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">Review in console</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-[var(--rd-line)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rd-forest)]">
              Pricing
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold">
              Proof. Then protection.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--rd-muted)]">
              Three tiers. Guard is the one brands remember.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 70}>
                <Card
                  className={
                    tier.featured
                      ? "relative border-2 border-[var(--rd-forest)] shadow-md"
                      : ""
                  }
                >
                  {tier.featured ? (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Recommended
                    </Badge>
                  ) : null}
                  <CardContent className="space-y-4 p-6">
                    <p className="text-sm font-semibold text-[var(--rd-muted)]">
                      {tier.name}
                    </p>
                    <p className="text-4xl font-bold">
                      {tier.price}
                      {tier.price.startsWith("$") ? (
                        <span className="text-base font-medium text-[var(--rd-muted)]">
                          /mo
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-[var(--rd-muted)]">{tier.blurb}</p>
                    <Button
                      asChild
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                    >
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[var(--rd-muted)]">
            Full comparison on{" "}
            <Link href="/pricing" className="font-semibold text-[var(--rd-forest)] hover:underline">
              the pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="rd-grid-bg py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
              Questions brands actually ask
            </h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 40}>
                <details className="group rounded-2xl border border-[var(--rd-line)] bg-white px-5 py-4 open:shadow-sm">
                  <summary className="cursor-pointer list-none text-base font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {faq.q}
                      <span className="text-[var(--rd-muted)] transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--rd-muted)]">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 rounded-2xl bg-[var(--rd-ink)] p-8 text-white">
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold">
              If they didn&apos;t pay, they don&apos;t speak for your brand.
            </p>
            <p className="mt-3 max-w-lg text-sm text-white/70">
              Click the live wall. Then publish yours.
            </p>
            <Button asChild size="lg" className="mt-6 bg-white text-[var(--rd-forest)] hover:bg-[var(--rd-mint)]">
              <Link href="#live-proof">
                See a live proof wall
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}
