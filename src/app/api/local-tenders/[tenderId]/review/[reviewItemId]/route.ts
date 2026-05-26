import { NextRequest, NextResponse } from "next/server";
import { updateLocalReviewItemStatus } from "@/lib/local-workspace/server";
import type { LocalTenderReviewStatus } from "@/lib/local-workspace/types";

type LocalReviewRouteParams = {
  params: Promise<{ reviewItemId: string; tenderId: string }>;
};

function parseStatus(value: unknown): LocalTenderReviewStatus {
  if (value === "In controllo" || value === "Chiuso") {
    return value;
  }

  return "Aperto";
}

export async function PATCH(request: NextRequest, { params }: LocalReviewRouteParams) {
  const { reviewItemId, tenderId } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const workspace = await updateLocalReviewItemStatus({
    reviewItemId,
    status: parseStatus(body.status),
    tenderId
  });

  if (!workspace) {
    return NextResponse.json({ error: "Gara locale non trovata" }, { status: 404 });
  }

  return NextResponse.json({ workspace });
}
