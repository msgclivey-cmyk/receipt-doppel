"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/misc";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/misc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustInlineBadge } from "@/components/proof/badges";

type Brand = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  tagline: string | null;
  industry: string;
  protectionActive: boolean;
  paymentProvider: string | null;
  paymentConnected: boolean;
  paymentAccountId: string | null;
};

export function SettingsClient({
  brand,
  appUrl,
}: {
  brand: Brand;
  appUrl: string;
}) {
  const router = useRouter();
  const [local, setLocal] = useState(brand);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await fetch("/api/brands", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          domain: fd.get("domain"),
          tagline: fd.get("tagline"),
          industry: fd.get("industry"),
          protectionActive: local.protectionActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setLocal(data.brand);
      setMessage("Brand profile saved.");
      router.refresh();
    });
  }

  function connect(provider: "stripe" | "paddle") {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/payments/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Connect failed");
        return;
      }
      setLocal(data.brand);
      setMessage(data.message);
      router.refresh();
    });
  }

  function disconnect() {
    startTransition(async () => {
      const res = await fetch("/api/payments/sync", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Disconnect failed");
        return;
      }
      setLocal(data.brand);
      setMessage("Payment connection removed (demo).");
      router.refresh();
    });
  }

  const proofUrl = `${appUrl}/proof/${local.slug}`;
  const embedSnippet = `<iframe src="${appUrl}/embed/${local.slug}" title="Receipt Doppel proof" style="width:100%;min-height:480px;border:0;border-radius:12px" loading="lazy"></iframe>`;
  const badgeSnippet = `<a href="${proofUrl}" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #0b5c45;border-radius:8px;text-decoration:none;font-family:system-ui,sans-serif">
  <span style="color:#0b5c45;font-weight:700;font-size:14px">Paid customer · Brand not impersonated</span>
</a>`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--rd-ink)] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-[var(--rd-muted)]">
          Demo payment connect, brand profile, and embed codes. Review collection
          happens on the thank-you page after a paid order — not as a separate chore.
        </p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment connect (demo)</CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              No real Stripe or Paddle secrets. Connect stores a demo account so
              you can create a thank-you page for a paid order.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-[var(--rd-line)] bg-[var(--rd-mist)] p-4 text-sm">
              {local.paymentConnected ? (
                <>
                  <p className="font-semibold text-[var(--rd-forest)]">
                    Connected to{" "}
                    {local.paymentProvider === "paddle" ? "Paddle" : "Stripe"}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--rd-muted)]">
                    {local.paymentAccountId}
                  </p>
                </>
              ) : (
                <p className="text-[var(--rd-muted)]">No payment provider connected.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={pending}
                onClick={() => connect("stripe")}
                variant={local.paymentProvider === "stripe" ? "default" : "outline"}
              >
                Connect Stripe
              </Button>
              <Button
                disabled={pending}
                onClick={() => connect("paddle")}
                variant={local.paymentProvider === "paddle" ? "default" : "outline"}
              >
                Connect Paddle
              </Button>
              {local.paymentConnected ? (
                <Button variant="ghost" disabled={pending} onClick={disconnect}>
                  Disconnect
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand name</Label>
                <Input id="name" name="name" defaultValue={local.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Primary domain</Label>
                <Input id="domain" name="domain" defaultValue={local.domain} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  defaultValue={local.tagline || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  name="industry"
                  defaultValue={local.industry}
                  className="flex h-10 w-full rounded-md border border-[var(--rd-line)] bg-white px-3 text-sm"
                >
                  <option value="DTC">DTC</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--rd-line)] p-3">
                <div>
                  <p className="text-sm font-medium">Protection monitoring</p>
                  <p className="text-xs text-[var(--rd-muted)]">
                    Lookalike domains and fake review farms
                  </p>
                </div>
                <Switch
                  checked={local.protectionActive}
                  onCheckedChange={(v) =>
                    setLocal((b) => ({ ...b, protectionActive: v }))
                  }
                />
              </div>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Embed codes</CardTitle>
            <p className="text-sm text-[var(--rd-muted)]">
              Drop these on your storefront. Preview the badge context at{" "}
              <a href="/badge-demo" className="font-semibold text-[var(--rd-forest)]">
                /badge-demo
              </a>
              .
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <TrustInlineBadge
              provider={
                local.paymentProvider === "paddle" ? "Paddle" : "Stripe"
              }
            />
            <div className="space-y-2">
              <Label>Proof wall URL</Label>
              <Input readOnly value={proofUrl} />
            </div>
            <div className="space-y-2">
              <Label>Iframe embed</Label>
              <Textarea readOnly value={embedSnippet} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Trust badge HTML</Label>
              <Textarea readOnly value={badgeSnippet} className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
