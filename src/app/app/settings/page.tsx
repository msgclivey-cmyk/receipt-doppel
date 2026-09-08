import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { SettingsClient } from "@/components/app/settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const ctx = await requireUser();
  if (!ctx?.brand) redirect("/login");

  return (
    <SettingsClient
      brand={ctx.brand}
      appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:4317"}
    />
  );
}
