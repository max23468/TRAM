import { NextRequest, NextResponse } from "next/server";
import { readLocalTenderWorkspace } from "@/lib/local-workspace/server";

type LocalTenderRouteParams = {
  params: Promise<{ tenderId: string }>;
};

export async function GET(_request: NextRequest, { params }: LocalTenderRouteParams) {
  const { tenderId } = await params;
  const workspace = await readLocalTenderWorkspace(tenderId);

  if (!workspace) {
    return NextResponse.json({ error: "Gara locale non trovata" }, { status: 404 });
  }

  return NextResponse.json({ workspace });
}
