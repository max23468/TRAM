import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "risk" | "success";

const variantClassName: Record<BadgeVariant, string> = {
  default: "border-primary/20 bg-secondary text-secondary-foreground",
  muted: "border-border bg-muted text-muted-foreground",
  risk: "border-amber-300 bg-amber-50 text-amber-900",
  success: "border-emerald-300 bg-emerald-50 text-emerald-900"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 text-xs font-medium",
        variantClassName[variant],
        className
      )}
      {...props}
    />
  );
}
