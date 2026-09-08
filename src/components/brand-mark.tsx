import Link from "next/link";
import { cn } from "@/lib/utils";

export function ShieldLogo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M16 2.5L27 7v8.2c0 7.1-4.7 11.8-11 13.3C9.7 27 5 22.3 5 15.2V7l11-4.5Z"
        fill="currentColor"
      />
      <path
        d="M11.2 15.8 14.1 18.7 20.8 12"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-[var(--rd-forest)]",
        className,
      )}
    >
      <ShieldLogo className="text-[var(--rd-forest)]" size={compact ? 24 : 28} />
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-semibold tracking-tight",
          compact ? "text-base" : "text-lg",
        )}
      >
        Receipt Doppel
      </span>
    </Link>
  );
}
