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
  askAfterAt: string;
  lastReviewEmailAt: string | null;
  ready: boolean;
  asked: boolean;
};

type AskResult = {
  inviteUrl: string;
  emailed: boolean;
  mailto: string | null;
};

function waitLabel(iso: string) {
  const days = Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  if (days <= 0) return "ready";
  if (days === 1) return "opens tomorrow";
  return `opens in ${days} days`;
}

export function RequestReviewPanel({
  paymentConnected,
  provider,
  reviewAskAfterDays,
  initialCharges,
}: {
  paymentConnected: boolean;
  provider: string | null;
  reviewAskAfterDays: number;
  initialCharges: ChargeRow[];
}) {
  const router = useRouter();
  const [charges, setCharges] = useState(initialCharges);
  const [ask, setAsk] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [askingId, setAskingId] = useState<string | null>(null);

  async function refreshCharges() {
    const list = await fetch("/api/charges");
    const listed = await list.json();
    if (list.ok) setCharges(listed.charges);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError(null);
    setAsk(null);
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
      form.reset();
      router.refresh();
      await refreshCharges();
    });
  }

  function askReview(id: string, force: boolean) {
    setError(null);
    setAsk(null);
    setAskingId(id);
    startTransition(async () => {
      const res = await fetch(`/api/charges/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      setAskingId(null);
      if (!res.ok) {
        setError(data.error || "Could not ask for a review.");
        return;
      }
      setAsk({
        inviteUrl: data.inviteUrl,
        emailed: Boolean(data.emailed),
        mailto: data.mailto || null,
      });
      router.refresh();
      await refreshCharges();
    });
  }

  function copy() {
    if (!ask?.inviteUrl) return;
    void navigator.clipboard.writeText(ask.inviteUrl);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--rd-muted)]">
        Do not ask on the thank-you page. They have not used the product yet —
        that quote would be fake. Record the paid order, wait{" "}
        <span className="font-semibold text-[var(--rd-ink)]">
          {reviewAskAfterDays === 0
            ? "until they have used it"
            : `${reviewAskAfterDays} day${reviewAskAfterDays === 1 ? "" : "s"}`}
        </span>
        , then send one polite email. Skip is allowed. No extra account.
      </p>
      {!paymentConnected ? (
        <Alert>
          Connect Stripe or Paddle in Settings first. Then you can record a
          paid order and ask later.
        </Alert>
      ) : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {ask ? (
        <Alert variant={ask.emailed ? "success" : "default"}>
          {ask.emailed ? (
            <p className="font-semibold">Email sent. They can skip it.</p>
          ) : (
            <>
              <p className="font-semibold">Email is not connected</p>
              <p className="mt-1 text-sm">
                Add <span className="font-mono">RESEND_API_KEY</span> and a from
                address to send from this console. We did not pretend to send
                anything. Use the draft in your mail app, or copy the link.
              </p>
            </>
          )}
          <p className="mt-2 break-all font-mono text-xs">{ask.inviteUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={copy}>
              Copy review link
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={ask.inviteUrl} target="_blank" rel="noreferrer">
                Preview as buyer
              </a>
            </Button>
            {ask.mailto && !ask.emailed ? (
              <Button asChild size="sm">
                <a href={ask.mailto}>Open email draft</a>
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
          <Input id="orderRef" name="orderRef" placeholder="59617" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending || !paymentConnected}>
            {pending && !askingId ? "Recording…" : "Record paid order"}
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
                    : charge.asked
                      ? " · asked"
                      : charge.ready
                        ? " · ready to ask"
                        : ` · ${waitLabel(charge.askAfterAt)}`}
                </span>
              </p>
              {!charge.hasReview && charge.status === "paid" ? (
                <div className="flex flex-wrap gap-2">
                  {charge.ready ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={pending}
                      onClick={() => askReview(charge.id, false)}
                    >
                      {askingId === charge.id
                        ? "Sending…"
                        : "Email a review ask"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => askReview(charge.id, true)}
                    >
                      {askingId === charge.id
                        ? "Sending…"
                        : "They've used it — ask now"}
                    </Button>
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
