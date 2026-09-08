"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/misc";
import { loginAction, type AuthState } from "@/lib/actions";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div className="rd-grid-bg flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <BrandMark className="justify-center" />
          <CardTitle className="text-center text-2xl">Log in</CardTitle>
          <p className="text-center text-sm text-[var(--rd-muted)]">
            Demo: <code className="text-[var(--rd-forest)]">alex@acmebrew.co</code> /{" "}
            <code className="text-[var(--rd-forest)]">demo1234</code>
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} method="post" className="space-y-4">
            {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="alex@acmebrew.co"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="demo1234"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--rd-muted)]">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-[var(--rd-forest)]">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
