import { NextRequest, NextResponse } from "next/server";
import {
  createLocalTenderWorkspace,
  listLocalTenderSummaries,
  normalizeLocalTenderInput
} from "@/lib/local-workspace/server";
import type { LocalTenderPrivacy } from "@/lib/local-workspace/types";

export async function GET() {
  return NextResponse.json({ tenders: await listLocalTenderSummaries() });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData
    .getAll("documents")
    .filter((value): value is File => value instanceof File && value.size >= 0);
  const input = normalizeLocalTenderInput({
    authority: String(formData.get("authority") ?? ""),
    city: String(formData.get("city") ?? ""),
    files,
    name: String(formData.get("name") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    owner: String(formData.get("owner") ?? ""),
    packageReference: String(formData.get("packageReference") ?? ""),
    privacy: String(formData.get("privacy") ?? "Uso interno") as LocalTenderPrivacy,
    stage: String(formData.get("stage") ?? "Gara")
  });

  const workspace = await createLocalTenderWorkspace(input);

  return NextResponse.json(
    {
      tenderId: workspace.tender.id,
      workspace
    },
    { status: 201 }
  );
}
