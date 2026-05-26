"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleDot, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import type { LocalTenderReviewStatus } from "@/lib/local-workspace/types";
import { cn } from "@/lib/utils";

export function LocalReviewActions({
  reviewItemId,
  status,
  tenderId
}: {
  reviewItemId: string;
  status: LocalTenderReviewStatus;
  tenderId: string;
}) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<LocalTenderReviewStatus | null>(null);

  async function updateStatus(nextStatus: LocalTenderReviewStatus) {
    setPendingStatus(nextStatus);
    await fetch(`/api/local-tenders/${tenderId}/review/${reviewItemId}`, {
      body: JSON.stringify({ status: nextStatus }),
      headers: { "content-type": "application/json" },
      method: "PATCH"
    });
    setPendingStatus(null);
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        className={cn(buttonVariants({ variant: status === "In controllo" ? "default" : "secondary" }))}
        disabled={Boolean(pendingStatus)}
        onClick={() => updateStatus("In controllo")}
        type="button"
      >
        {pendingStatus === "In controllo" ? (
          <Loader2 aria-hidden="true" className="animate-spin" size={15} />
        ) : (
          <CircleDot aria-hidden="true" size={15} />
        )}
        In controllo
      </button>
      <button
        className={cn(buttonVariants({ variant: status === "Chiuso" ? "default" : "secondary" }))}
        disabled={Boolean(pendingStatus)}
        onClick={() => updateStatus("Chiuso")}
        type="button"
      >
        {pendingStatus === "Chiuso" ? (
          <Loader2 aria-hidden="true" className="animate-spin" size={15} />
        ) : (
          <CheckCircle2 aria-hidden="true" size={15} />
        )}
        Chiudi
      </button>
    </div>
  );
}
