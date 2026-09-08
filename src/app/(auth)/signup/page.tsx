"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/misc";
import { signupAction, type AuthState } from "@/lib/actions";

const initial: AuthState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initial);

  return (
    <div className="rd-grid-bg flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <BrandMark className="justify-center" />
          <CardTitle className="text-center text-2xl">Create your proof wall</CardTitle>
          <p className="text-center text-sm text-[var(--rd-muted)]">
            Or use the demo account on the login page.
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} method="post" className="space-y-4">
            {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required placeholder="Alex Brewer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand name</Label>
              <Input
                id="brandName"
                name="brandName"
                required
                placeholder="Acme Brew Co."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating…" : "Start free proof wall"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--rd-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--rd-forest)]">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
