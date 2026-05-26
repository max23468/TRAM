import { NextRequest, NextResponse } from "next/server";
import { readWorkspaceStoredDocument } from "@/lib/workspace-documents";

type TenderDocumentRouteParams = {
  params: Promise<{ documentId: string; tenderId: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: TenderDocumentRouteParams
) {
  const { documentId, tenderId } = await params;
  const payload = await readWorkspaceStoredDocument({ documentId, tenderId });

  if (!payload) {
    return new NextResponse("Documento non trovato", { status: 404 });
  }

  const safeBody = Uint8Array.from(payload.body);

  return new NextResponse(safeBody, {
    headers: {
      "Content-Disposition": `inline; filename="${encodeURIComponent(payload.fileName)}"`,
      "Content-Type": payload.contentType
    }
  });
}
