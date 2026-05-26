import { NextRequest, NextResponse } from "next/server";
import { buildWorkspaceDocumentApiHref } from "@/lib/workspace-documents";

type LocalTenderDocumentRouteParams = {
  params: Promise<{ documentId: string; tenderId: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: LocalTenderDocumentRouteParams
) {
  const { documentId, tenderId } = await params;
  const target = new URL(buildWorkspaceDocumentApiHref(tenderId, documentId), request.url);
  return NextResponse.redirect(target, 307);
}
