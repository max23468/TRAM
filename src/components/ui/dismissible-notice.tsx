"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DismissibleNoticeProps = {
  children: ReactNode;
  className?: string;
};

export function DismissibleNotice({ children, className }: DismissibleNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Chiudi avviso"
        className="absolute right-3 top-3 rounded-md p-1 text-current opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
        onClick={() => setIsVisible(false)}
      >
        <X aria-hidden="true" size={16} />
      </button>
      {children}
    </section>
  );
}
