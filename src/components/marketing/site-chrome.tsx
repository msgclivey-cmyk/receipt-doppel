import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#what-we-do", label: "What we do" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#live-proof", label: "Live proof" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rd-line)]/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandMark compact />
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--rd-forest)] lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-opacity hover:opacity-70">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/#live-proof"
            className="truncate text-sm font-semibold text-[var(--rd-forest)] lg:hidden"
          >
            Live proof
          </Link>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Publish my wall</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--rd-line)] bg-[var(--rd-ink)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <BrandMark className="text-white [&_span]:text-white" href="/" />
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight">
            If they didn&apos;t pay, they don&apos;t speak for your brand.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-white/80">
          <li>
            <Link href="/proof/acme-brew" className="hover:text-white">
              Live proof wall
            </Link>
          </li>
          <li>
            <Link href="/badge-demo" className="hover:text-white">
              Storefront badge
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/signup" className="hover:text-white">
              Publish my wall
            </Link>
          </li>
        </ul>
        <ul className="space-y-2 text-sm text-white/90">
          <li>✓ Bound to Stripe or Paddle</li>
          <li>✓ Public wall + embed + badge</li>
          <li>✓ Lookalike takedown queue</li>
        </ul>
      </div>
    </footer>
  );
}
