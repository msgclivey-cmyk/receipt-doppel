import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--rd-forest)] text-white",
        outline:
          "border-[var(--rd-forest)] text-[var(--rd-forest)] bg-transparent",
        success:
          "border-[var(--rd-forest)]/30 bg-[var(--rd-mint)] text-[var(--rd-forest)]",
        muted:
          "border-[var(--rd-line)] bg-[var(--rd-mist)] text-[var(--rd-muted)]",
        danger:
          "border-red-200 bg-red-50 text-[var(--rd-danger)]",
        warn:
          "border-amber-200 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
