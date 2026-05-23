import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, type = "button", variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} type={type} {...props} />
  );
}
