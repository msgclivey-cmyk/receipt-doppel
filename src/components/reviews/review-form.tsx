"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/misc";
import { Alert } from "@/components/ui/misc";
import { formatMoney } from "@/lib/utils";

export function ReviewForm({
  token,
  brandName,
  amountCents,
  currency,
  orderRef,
  provider,
  defaultName,
  skipHref,
}: {
  token: string;
  brandName: string;
  amountCents: number;
  currency: string;
  orderRef: string;
  provider: string;
  defaultName: string;
  skipHref: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          authorName: defaultName,
          body: fd.get("body"),
          rating: 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit.");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="space-y-3">
        <Alert variant="success">Saved to order #{orderRef}. You can close this.</Alert>
        <Button asChild variant="outline">
          <Link href={skipHref}>Done</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <p className="text-sm text-[var(--rd-muted)]">
        Order #{orderRef} · {formatMoney(amountCents, currency)} ·{" "}
        {provider === "paddle" ? "Paddle" : "Stripe"}
      </p>
      <Textarea
        name="body"
        required
        minLength={12}
        rows={4}
        placeholder={`One sentence about ${brandName}. Skip if you don't want to.`}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Leave this on my receipt"}
        </Button>
        <Link
          href={skipHref}
          className="text-sm text-[var(--rd-muted)] hover:text-[var(--rd-ink)]"
        >
          Skip
        </Link>
      </div>
    </form>
  );
}
