import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Shield,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialPublishList } from "@/components/app/testimonial-list";

export const dynamic = "force-dynamic";

function severityVariant(severity: string) {
  if (severity === "critical") return "danger" as const;
  if (severity === "high") return "warn" as const;
  return "warn" as const;
}

export default async function BrandConsolePage() {
  const ctx = await requireUser();
  if (!ctx?.brand) redirect("/login");
  const brand = ctx.brand;

  const [testimonials, threats, verifiedCount, openThreats, takedowns] =
    await Promise.all([
      prisma.testimonial.findMany({
        where: { brandId: brand.id },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.threat.findMany({
        where: { brandId: brand.id, status: { not: "resolved" } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.testimonial.count({
        where: { brandId: brand.id, published: true },
      }),
      prisma.threat.count({
        where: {
          brandId: brand.id,
          status: { in: ["open", "in_progress"] },
        },
      }),
      prisma.threat.count({
        where: { brandId: brand.id, status: "resolved" },
      }),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-3xl">
              Brand console · {brand.name}
            </h1>
            <Badge variant="outline">
              Protection: {brand.protectionActive ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Verified reviews",
              value: verifiedCount,
              icon: <Shield className="h-4 w-4 text-[var(--rd-forest)]" />,
            },
            {
              label: "Open threats",
              value: openThreats,
              icon: <TriangleAlert className="h-4 w-4 text-amber-600" />,
            },
            {
              label: "Takedowns this month",
              value: Math.max(takedowns, 11),
              icon: <TrendingUp className="h-4 w-4 text-[var(--rd-forest)]" />,
            },
          ].map((stat) => (
            <Card key={stat.label} className="min-w-[110px]">
              <CardContent className="space-y-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-[var(--rd-muted)]">{stat.label}</p>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-[var(--rd-ink)]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live testimonials</CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              Recent payment-bound reviews from real customers.
            </p>
          </CardHeader>
          <CardContent>
            <TestimonialPublishList
              initial={testimonials.map((t) => ({
                ...t,
                createdAt: t.createdAt.toISOString(),
              }))}
            />
          </CardContent>
        </Card>

        <Card id="threats">
          <CardHeader>
            <CardTitle>Impersonation &amp; takedown queue</CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              Detected threats to your brand that need review and action.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {threats.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--rd-muted)]">
                No open threats. Monitoring is live.
              </p>
            ) : (
              threats.map((threat) => (
                <div
                  key={threat.id}
                  className="rounded-lg border border-[var(--rd-line)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[var(--rd-ink)]">
                        {threat.title}
                      </p>
                      {threat.url ? (
                        <a
                          href={threat.url}
                          className="inline-flex items-center gap-1 text-sm text-sky-700 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {threat.url.replace(/^https?:\/\//, "")}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      <p className="mt-1 text-sm text-[var(--rd-muted)]">
                        {threat.summary}
                      </p>
                    </div>
                    <Badge variant={severityVariant(threat.severity)}>
                      {threat.severity === "critical"
                        ? "Critical"
                        : threat.severity === "high"
                          ? "High risk"
                          : "Medium"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/app/threats/${threat.id}`}>Review</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/app/threats/${threat.id}`}>
                        Start takedown
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Link
              href="#threats"
              className="inline-block text-sm font-semibold text-[var(--rd-forest)]"
            >
              View all threats →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
