"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/misc";
import { formatMoney } from "@/lib/utils";

type ChargeRow = {
  id: string;
  orderRef: string;
  amountCents: number;
  currency: string;
  customerName: string;
  customerEmailMask: string;
  provider: string;
  status: string;
  hasReview: boolean;
  reviewPublished: boolean | null;
};

export function RequestReviewPanel({
  paymentConnected,
  provider,
  initialCharges,
}: {
  paymentConnected: boolean;
  provider: string | null;
  initialCharges: ChargeRow[];
}) {
  const router = useRouter();
  const [charges, setCharges] = useState(initialCharges);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError(null);
    setInviteUrl(null);
    startTransition(async () => {
      const res = await fetch("/api/charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          customerEmail: fd.get("customerEmail"),
          amountCents: Math.round(Number(fd.get("amount")) * 100),
          orderRef: fd.get("orderRef") || undefined,
          provider: provider || "stripe",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not record the order.");
        return;
      }
      setInviteUrl(data.inviteUrl);
      const email = String(fd.get("customerEmail") || "");
      const subject = encodeURIComponent("Leave a verified review");
      const body = encodeURIComponent(
        `Thanks for your order. Leave a review bound to that payment here:\n\n${data.inviteUrl}\n`,
      );
      setMailto(`mailto:${email}?subject=${subject}&body=${body}`);
      form.reset();
      router.refresh();
      const list = await fetch("/api/charges");
      const listed = await list.json();
      if (list.ok) setCharges(listed.charges);
    });
  }

  function copy() {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl);
  }

  async function resend(id: string) {
    setError(null);
    const res = await fetch(`/api/charges/${id}/invite`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not mint a new link.");
      return;
    }
    setInviteUrl(data.inviteUrl);
    setMailto(null);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--rd-muted)]">
        Do not send buyers on a homework hunt. After Stripe/Paddle checkout,
        this link <span className="font-semibold text-[var(--rd-ink)]">is the thank-you page</span>
        — name and order already known, one sentence, skip allowed. Same URL
        works as a QR on a cafe receipt. Email is only a backup if they close
        the tab.
      </p>
      {!paymentConnected ? (
        <Alert>
          Connect Stripe or Paddle in Settings first. Then you can record a
          paid order and invite the buyer.
        </Alert>
      ) : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {inviteUrl ? (
        <Alert variant="success">
          <p className="font-semibold">Thank-you page for this order</p>
          <p className="mt-1 text-sm">
            Put this on Stripe/Paddle success, or print it as a QR. The buyer is
            already here.
          </p>
          <p className="mt-1 break-all font-mono text-xs">{inviteUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={copy}>
              Copy thank-you URL
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={inviteUrl} target="_blank" rel="noreferrer">
                Preview as buyer
              </a>
            </Button>
            {mailto ? (
              <Button asChild size="sm" variant="ghost">
                <a href={mailto}>Backup: email the link</a>
              </Button>
            ) : null}
          </div>
        </Alert>
      ) : null}
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="customerName">Buyer name</Label>
          <Input id="customerName" name="customerName" required placeholder="Casey Miller" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customerEmail">Buyer email</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            required
            placeholder="casey@email.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount paid (USD)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            placeholder="28"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="orderRef">Order number (optional)</Label>
          <Input id="orderRef" name="orderRef" placeholder="48291" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending || !paymentConnected}>
            {pending ? "Creating thank-you page…" : "Create thank-you page for this order"}
          </Button>
        </div>
      </form>
      {charges.length > 0 ? (
        <ul className="space-y-2 border-t border-[var(--rd-line)] pt-4">
          {charges.slice(0, 8).map((charge) => (
            <li
              key={charge.id}
              className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <p>
                <span className="font-semibold">{charge.customerName}</span>
                <span className="text-[var(--rd-muted)]">
                  {" "}
                  · {charge.customerEmailMask} · #{charge.orderRef} ·{" "}
                  {formatMoney(charge.amountCents, charge.currency)} ·{" "}
                  {charge.status}
                  {charge.hasReview
                    ? charge.reviewPublished
                      ? " · published"
                      : " · review in"
                    : " · waiting"}
                </span>
              </p>
              {!charge.hasReview && charge.status === "paid" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void resend(charge.id)}
                >
                  New thank-you link
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
