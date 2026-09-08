"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/misc";

export function ReviewLookupForm({ brandSlug }: { brandSlug: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug,
          customerEmail: fd.get("customerEmail"),
          orderRef: fd.get("orderRef"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No matching paid order.");
        return;
      }
      const token = String(data.inviteUrl || "").split("/review/")[1];
      if (!token) {
        setError("Could not open the review form.");
        return;
      }
      router.push(`/review/${token}`);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <div className="space-y-1.5">
        <Label htmlFor="customerEmail">Email on the order</Label>
        <Input id="customerEmail" name="customerEmail" type="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="orderRef">Order number</Label>
        <Input id="orderRef" name="orderRef" required placeholder="48291" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Checking…" : "Open my review form"}
      </Button>
    </form>
  );
}
