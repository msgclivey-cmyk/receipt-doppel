import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/proof/acme-brew", label: "Proof wall" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rd-line)]/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--rd-forest)] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-80">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--rd-line)] bg-[var(--rd-ink)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <BrandMark className="text-white [&_span]:text-white" href="/" />
        </div>
        <p className="max-w-md text-sm text-white/75">
          Real payments. Real customers. Real protection. Payment-bound
          testimonials with impersonation takedowns in one trust product.
        </p>
        <ul className="space-y-2 text-sm text-white/90">
          <li>✓ Bound to Stripe or Paddle</li>
          <li>✓ Domain impersonation detection</li>
          <li>✓ Takedowns that actually work</li>
        </ul>
      </div>
    </footer>
  );
}
