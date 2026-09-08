import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function main() {
  await prisma.reviewInvite.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.threat.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const alex = await prisma.user.create({
    data: {
      email: "alex@acmebrew.co",
      name: "Alex Brewer",
      passwordHash,
    },
  });

  const acme = await prisma.brand.create({
    data: {
      name: "Acme Brew Co.",
      slug: "acme-brew",
      domain: "acmebrewco.com",
      tagline: "Cold brew, roasted slow.",
      industry: "DTC",
      logoInitials: "AB",
      protectionActive: true,
      paymentProvider: "stripe",
      paymentConnected: true,
      paymentAccountId: "acct_demo_stripe_acme",
      ownerId: alex.id,
    },
  });

  const loomlyOwner = await prisma.user.create({
    data: {
      email: "maya@loomly.demo",
      name: "Maya Chen",
      passwordHash,
    },
  });

  const loomly = await prisma.brand.create({
    data: {
      name: "Loomly",
      slug: "loomly",
      domain: "loomly.demo",
      tagline: "Social scheduling that ships.",
      industry: "SaaS",
      logoInitials: "LM",
      protectionActive: true,
      paymentProvider: "paddle",
      paymentConnected: true,
      paymentAccountId: "acct_demo_paddle_loomly",
      ownerId: loomlyOwner.id,
    },
  });

  async function boundReview({
    brandId,
    slug,
    authorName,
    authorTitle,
    authorInitials,
    authorEmail,
    body,
    amountCents,
    provider,
    orderRef,
    category,
    createdAt,
    published = true,
    brandSafe = true,
  }: {
    brandId: string;
    slug: string;
    authorName: string;
    authorTitle: string;
    authorInitials: string;
    authorEmail: string;
    body: string;
    amountCents: number;
    provider: string;
    orderRef: string;
    category: string;
    createdAt: Date;
    published?: boolean;
    brandSafe?: boolean;
  }) {
    const charge = await prisma.charge.create({
      data: {
        brandId,
        provider,
        providerChargeId: `seed_${slug}_${orderRef}`,
        orderRef,
        amountCents,
        customerEmail: authorEmail,
        customerName: authorName,
        status: "paid",
        paidAt: createdAt,
        createdAt,
      },
    });
    await prisma.reviewInvite.create({
      data: {
        brandId,
        chargeId: charge.id,
        tokenHash: hashToken(`seed-used-${slug}-${orderRef}`),
        expiresAt: createdAt,
        usedAt: createdAt,
        createdAt,
      },
    });
    await prisma.testimonial.create({
      data: {
        brandId,
        chargeId: charge.id,
        authorName,
        authorTitle,
        authorInitials,
        authorEmailMask: `${authorEmail[0]}***@${authorEmail.split("@")[1]}`,
        body,
        rating: 5,
        amountCents,
        provider,
        orderRef,
        published,
        brandSafe,
        category,
        createdAt,
      },
    });
  }

  const now = Date.now();
  const acmeTestimonials = [
    {
      authorName: "Casey M.",
      authorTitle: "Subscriber",
      authorInitials: "CM",
      authorEmail: "casey.m@gmail.com",
      body: "Acme Brew Co. never disappoints. Bold, clean cold brew — and I love that every review here is tied to a real order.",
      amountCents: 2800,
      provider: "stripe",
      orderRef: "48291",
      category: "DTC",
      minutesAgo: 12,
    },
    {
      authorName: "Jordan T.",
      authorTitle: "Wholesale buyer",
      authorInitials: "JT",
      authorEmail: "jordan.t@cafe.io",
      body: "We stocked Acme for our cafes after tasting the sample. The proof wall made it obvious they weren't faking reviews.",
      amountCents: 14900,
      provider: "stripe",
      orderRef: "51736",
      category: "DTC",
      minutesAgo: 28,
      brandSafe: true,
    },
    {
      authorName: "Sara R.",
      authorTitle: "Monthly club member",
      authorInitials: "SR",
      authorEmail: "sara.r@hey.com",
      body: "Subscription day is the best day. Smooth chocolate notes, no watery aftertaste — and the trust badge on their site sealed it.",
      amountCents: 3200,
      provider: "stripe",
      orderRef: "46302",
      category: "DTC",
      minutesAgo: 55,
    },
    {
      authorName: "Maya Chen",
      authorTitle: "Founder at Loomly",
      authorInitials: "MC",
      authorEmail: "maya@loomly.demo",
      body: "Receipt Doppel gives our prospects instant confidence. Seeing a real payment receipt sealed to Stripe was the nudge that closed more deals.",
      amountCents: 4900,
      provider: "stripe",
      orderRef: "48910",
      category: "SaaS",
      minutesAgo: 120,
    },
    {
      authorName: "Jordan Blake",
      authorTitle: "Head of Growth at Nestful",
      authorInitials: "JB",
      authorEmail: "jordan.b@nestful.io",
      body: "We had a competitor faking customer logos and testimonials. Receipt Doppel made it easy to show what's real — and shut that down.",
      amountCents: 14900,
      provider: "stripe",
      orderRef: "50112",
      category: "SaaS",
      minutesAgo: 240,
      brandSafe: true,
    },
    {
      authorName: "Priya Nair",
      authorTitle: "Co-founder at ShopSol",
      authorInitials: "PN",
      authorEmail: "priya@shopsol.co",
      body: "Adding verified receipts to our site increased trial-to-paid conversions by 23% in two weeks. The trust signal is undeniable.",
      amountCents: 9900,
      provider: "paddle",
      orderRef: "44881",
      category: "SaaS",
      minutesAgo: 400,
    },
    {
      authorName: "Alex Lawrence",
      authorTitle: "CEO at Clearbitly",
      authorInitials: "AL",
      authorEmail: "alex.l@clearbitly.com",
      body: "Setup took minutes and the impact was immediate. Prospects love that every review here is tied to a real payment.",
      amountCents: 4900,
      provider: "stripe",
      orderRef: "47220",
      category: "SaaS",
      minutesAgo: 800,
    },
    {
      authorName: "Riley Quince",
      authorTitle: "Cafe owner",
      authorInitials: "RQ",
      authorEmail: "riley@northline.cafe",
      body: "Ordered a case for the shop. Baristas and regulars both asked where we got it. Real receipts beat fake five-star spam.",
      amountCents: 8600,
      provider: "stripe",
      orderRef: "53001",
      category: "DTC",
      minutesAgo: 960,
    },
  ];

  for (const t of acmeTestimonials) {
    await boundReview({
      brandId: acme.id,
      slug: acme.slug,
      authorName: t.authorName,
      authorTitle: t.authorTitle,
      authorInitials: t.authorInitials,
      authorEmail: t.authorEmail,
      body: t.body,
      amountCents: t.amountCents,
      provider: t.provider,
      orderRef: t.orderRef,
      category: t.category,
      createdAt: new Date(now - t.minutesAgo * 60_000),
      brandSafe: t.brandSafe ?? true,
    });
  }

  await boundReview({
    brandId: loomly.id,
    slug: loomly.slug,
    authorName: "Devon Park",
    authorTitle: "Marketing lead",
    authorInitials: "DP",
    authorEmail: "devon@vero.app",
    body: "Loomly's proof wall made renewal a no-brainer. Payment-bound reviews beat screenshots every time.",
    amountCents: 7900,
    provider: "paddle",
    orderRef: "90011",
    category: "SaaS",
    createdAt: new Date(now - 180 * 60_000),
  });
  await boundReview({
    brandId: loomly.id,
    slug: loomly.slug,
    authorName: "Sam Ortiz",
    authorTitle: "Founder",
    authorInitials: "SO",
    authorEmail: "sam@peak.tools",
    body: "We almost bought from a lookalike site. Loomly's Receipt Doppel badge kept us on the real product.",
    amountCents: 14900,
    provider: "paddle",
    orderRef: "90042",
    category: "SaaS",
    createdAt: new Date(now - 360 * 60_000),
  });

  const threats = [
    {
      title: "Lookalike domain impersonating Acme Brew Co",
      type: "lookalike_domain",
      severity: "critical",
      status: "open",
      url: "https://acme-brew-deals.com",
      summary:
        "Fake review farm + cloned storefront detected on acme-brew-deals.com",
      evidenceJson: JSON.stringify({
        whois: {
          domain: "acme-brew-deals.com",
          registered: "4 days ago",
          registrar: "NameCheap, Inc.",
          privacy: "WhoisGuard",
          privacyRisk: "High risk",
        },
        screenshots: {
          real: { label: "acmebrewco.com", status: "Verified" },
          fake: { label: "acme-brew-deals.com", status: "Lookalike" },
        },
        stolenTestimonials: [
          {
            name: "Jessica M.",
            body: "Worst cold brew ever. Bitter and watery.",
            label: "Not in your payment graph",
          },
          {
            name: "Daniel K.",
            body: "Shipping took forever. Do not recommend.",
            label: "Not in your payment graph",
          },
          {
            name: "Sarah T.",
            body: "Looks fake. Probably dropshipped trash.",
            label: "Not in your payment graph",
          },
        ],
        ads: [
          "Stolen bottle hero on Meta",
          "Cloned 'subscribe & save' creative",
          "Lookalike UGC reel using Acme cans",
        ],
        checklist: [
          { id: "evidence", label: "Compile evidence pack", done: true, at: "May 22, 2025" },
          { id: "registrar", label: "Notify registrar", done: false },
          { id: "dmca", label: "DMCA / platform report", done: false },
          { id: "banner", label: "Customer warning banner", done: false },
        ],
        timeline: [
          {
            id: "detected",
            label: "Detected",
            done: true,
            at: "May 22, 2025, 10:15 AM",
            by: "Auto-monitor",
          },
          {
            id: "triaged",
            label: "Triaged",
            done: true,
            at: "May 22, 2025, 10:42 AM",
            by: "Analyst",
          },
          {
            id: "awaiting",
            label: "Awaiting action",
            done: false,
            at: "Pending",
            by: null,
          },
        ],
      }),
    },
    {
      title: "Fake review farm on TrustPilot clone",
      type: "fake_review_farm",
      severity: "critical",
      status: "open",
      url: "https://trustpilot-clone.example/acme-brew",
      summary:
        "Inauthentic 1-star review cluster with no matching Stripe charges.",
      evidenceJson: JSON.stringify({
        whois: {
          domain: "trustpilot-clone.example",
          registered: "11 days ago",
          registrar: "Unknown",
          privacy: "Hidden",
          privacyRisk: "High risk",
        },
        screenshots: {
          real: { label: "Proof wall", status: "Verified" },
          fake: { label: "Clone profile 1.2★", status: "Lookalike" },
        },
        stolenTestimonials: [
          {
            name: "Anon buyer",
            body: "Scam brand. Do not buy.",
            label: "Not in your payment graph",
          },
        ],
        ads: [],
        checklist: [
          { id: "evidence", label: "Compile evidence pack", done: true, at: "May 21, 2025" },
          { id: "registrar", label: "Notify host", done: false },
          { id: "dmca", label: "Platform abuse report", done: false },
          { id: "banner", label: "Customer warning banner", done: false },
        ],
        timeline: [
          {
            id: "detected",
            label: "Detected",
            done: true,
            at: "May 21, 2025, 3:02 PM",
            by: "Auto-monitor",
          },
          {
            id: "triaged",
            label: "Triaged",
            done: true,
            at: "May 21, 2025, 3:40 PM",
            by: "Analyst",
          },
          {
            id: "awaiting",
            label: "Awaiting action",
            done: false,
            at: "Pending",
            by: null,
          },
        ],
      }),
    },
    {
      title: "Meta ad using stolen creatives",
      type: "stolen_creatives",
      severity: "medium",
      status: "open",
      url: "https://facebook.com/ads/library/demo-acme",
      summary:
        "Unauthorized Meta ads reusing Acme Brew Co product photography.",
      evidenceJson: JSON.stringify({
        whois: null,
        screenshots: {
          real: { label: "Official creatives", status: "Verified" },
          fake: { label: "Unauthorized Meta ad", status: "Stolen" },
        },
        stolenTestimonials: [],
        ads: [
          "Cold brew bottle close-up (stolen)",
          "Subscribe CTA cloned from PDP",
          "UGC-style reel with Acme cans",
        ],
        checklist: [
          { id: "evidence", label: "Compile evidence pack", done: true, at: "May 20, 2025" },
          { id: "registrar", label: "Report to Meta", done: false },
          { id: "dmca", label: "DMCA notice", done: false },
          { id: "banner", label: "Customer warning banner", done: false },
        ],
        timeline: [
          {
            id: "detected",
            label: "Detected",
            done: true,
            at: "May 20, 2025, 9:11 AM",
            by: "Ad monitor",
          },
          {
            id: "triaged",
            label: "Triaged",
            done: false,
            at: "Pending",
            by: null,
          },
          {
            id: "awaiting",
            label: "Awaiting action",
            done: false,
            at: "Pending",
            by: null,
          },
        ],
      }),
    },
  ];

  for (const threat of threats) {
    await prisma.threat.create({
      data: {
        brandId: acme.id,
        ...threat,
      },
    });
  }

  console.log("Seeded Receipt Doppel demo data");
  console.log("Login: alex@acmebrew.co / demo1234");
  console.log(`Proof wall: /proof/${acme.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
