import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppSidebar } from "@/components/app/sidebar";
import { BrandMark } from "@/components/brand-mark";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireUser();
  if (!ctx?.brand) redirect("/login");

  const openThreats = await prisma.threat.count({
    where: {
      brandId: ctx.brand.id,
      status: { in: ["open", "in_progress"] },
    },
  });

  return (
    <div className="flex min-h-screen bg-[var(--rd-mist)]">
      <div className="sticky top-0 hidden h-screen md:block">
        <AppSidebar brandName={ctx.brand.name} openThreats={openThreats} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-[var(--rd-line)] bg-white px-4 py-3 md:hidden">
          <BrandMark href="/app" compact />
          <div className="flex gap-3 text-sm font-semibold text-[var(--rd-forest)]">
            <Link href="/app">Console</Link>
            <Link href="/app/settings">Settings</Link>
            {openThreats > 0 ? (
              <Link href="/app#threats">Threats ({openThreats})</Link>
            ) : null}
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
