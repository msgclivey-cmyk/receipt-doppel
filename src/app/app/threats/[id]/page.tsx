import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldLogo } from "@/components/brand-mark";
import { TakedownPanel } from "@/components/app/takedown-panel";

export const dynamic = "force-dynamic";

export default async function ThreatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireUser();
  if (!ctx?.brand) redirect("/login");

  const threat = await prisma.threat.findFirst({
    where: { id, brandId: ctx.brand.id },
  });
  if (!threat) notFound();

  const evidence = JSON.parse(threat.evidenceJson) as {
    whois: {
      domain: string;
      registered: string;
      registrar: string;
      privacy: string;
      privacyRisk: string;
    } | null;
    screenshots: {
      real: { label: string; status: string };
      fake: { label: string; status: string };
    };
    stolenTestimonials: { name: string; body: string; label: string }[];
    ads: string[];
    checklist: { id: string; label: string; done: boolean; at?: string }[];
    timeline: {
      id: string;
      label: string;
      done: boolean;
      at: string;
      by: string | null;
    }[];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <nav className="text-sm text-[var(--rd-muted)]">
          <Link href="/app" className="hover:text-[var(--rd-forest)]">
            Brand protection
          </Link>
          {" / "}
          <Link href="/app#threats" className="hover:text-[var(--rd-forest)]">
            Queue
          </Link>
          {" / "}
          <span className="font-semibold text-[var(--rd-ink)]">
            Threat #{id.slice(-4)}
          </span>
        </nav>
        <div className="relative text-[var(--rd-muted)]">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--rd-danger)] text-[10px] text-white">
            3
          </span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-3xl">
            {threat.title}
          </h1>
          <Badge
            variant={
              threat.severity === "critical"
                ? "danger"
                : threat.severity === "high"
                  ? "warn"
                  : "warn"
            }
          >
            {threat.severity === "critical"
              ? "Critical"
              : threat.severity === "high"
                ? "High"
                : "Medium"}
          </Badge>
        </div>
        <p className="mt-2 text-[var(--rd-muted)]">{threat.summary}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {evidence.whois ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Domain WHOIS</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[var(--rd-muted)]">Domain</p>
                  <p className="font-medium">{evidence.whois.domain}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--rd-muted)]">Registered</p>
                  <p className="font-medium">{evidence.whois.registered}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--rd-muted)]">Registrar</p>
                  <p className="font-medium">{evidence.whois.registrar}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--rd-muted)]">Privacy</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{evidence.whois.privacy}</p>
                    <Badge variant="danger">{evidence.whois.privacyRisk}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Screenshot comparison</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[evidence.screenshots.real, evidence.screenshots.fake].map(
                (shot, i) => (
                  <div
                    key={shot.label}
                    className="overflow-hidden rounded-lg border border-[var(--rd-line)]"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--rd-line)] bg-[var(--rd-mist)] px-3 py-2 text-xs">
                      <span className="font-medium">{shot.label}</span>
                      <Badge variant={i === 0 ? "success" : "danger"}>
                        {shot.status}
                      </Badge>
                    </div>
                    <div
                      className={
                        i === 0
                          ? "flex h-36 items-center justify-center bg-gradient-to-br from-[var(--rd-mint)] to-white"
                          : "flex h-36 items-center justify-center bg-gradient-to-br from-red-50 to-white"
                      }
                    >
                      <div className="text-center">
                        <p className="text-sm font-bold tracking-wide">
                          ACME BREW CO.
                        </p>
                        <p className="text-xs text-[var(--rd-muted)]">
                          {i === 0 ? "Official storefront" : "Cloned storefront"}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </CardContent>
          </Card>

          {evidence.stolenTestimonials.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stolen testimonials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {evidence.stolenTestimonials.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-start justify-between gap-3 border-b border-[var(--rd-line)] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-sm text-[var(--rd-muted)]">{t.body}</p>
                    </div>
                    <Badge variant="danger" className="shrink-0">
                      {t.label}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {evidence.ads.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Social ads using brand assets
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {evidence.ads.map((ad) => (
                  <div
                    key={ad}
                    className="flex h-28 items-end rounded-lg border border-[var(--rd-line)] bg-gradient-to-t from-[#3a2618]/80 to-[#c4a484]/40 p-3 text-xs font-medium text-white"
                  >
                    {ad}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Takedown</CardTitle>
          </CardHeader>
          <CardContent>
            <TakedownPanel
              threatId={threat.id}
              status={threat.status}
              checklist={evidence.checklist}
              timeline={evidence.timeline}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--rd-muted)]">
        <p>
          Real proof wall remains live — buyers still see Paid &amp; verified
          badges on authentic reviews.
        </p>
        <Link
          href={`/proof/${ctx.brand.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-[var(--rd-forest)]"
        >
          <ShieldLogo size={16} />
          Proof wall: Live
        </Link>
      </div>
    </div>
  );
}
