import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-md border border-[var(--rd-line)] bg-white px-3 py-2 text-sm text-[var(--rd-ink)] placeholder:text-[var(--rd-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-forest)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Separator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-px w-full bg-[var(--rd-line)]", className)}
      {...props}
    />
  );
}

export function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "danger" | "success";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "default" &&
          "border-[var(--rd-line)] bg-[var(--rd-mist)] text-[var(--rd-ink)]",
        variant === "danger" &&
          "border-red-200 bg-red-50 text-[var(--rd-danger)]",
        variant === "success" &&
          "border-[var(--rd-forest)]/20 bg-[var(--rd-mint)] text-[var(--rd-forest)]",
        className,
      )}
      {...props}
    />
  );
}
