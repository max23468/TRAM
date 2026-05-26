import {
  readDemoWorkspaceStoredDocument
} from "./demo-workspace";
import { readLocalTenderStoredDocument } from "./local-workspace/server";

export type WorkspaceStoredDocument = {
  body: Uint8Array;
  contentType: string;
  fileName: string;
  mode: "demo-public" | "local";
};

export function buildWorkspaceDocumentApiHref(tenderId: string, documentId: string) {
  return `/api/tenders/${encodeURIComponent(tenderId)}/documents/${encodeURIComponent(documentId)}`;
}

export async function readWorkspaceStoredDocument({
  documentId,
  tenderId
}: {
  documentId: string;
  tenderId: string;
}): Promise<WorkspaceStoredDocument | null> {
  const localPayload = await readLocalTenderStoredDocument({ documentId, tenderId });

  if (localPayload) {
    return {
      body: Uint8Array.from(localPayload.body),
      contentType: localPayload.document.contentType,
      fileName: localPayload.document.fileName,
      mode: "local"
    };
  }

  const demoPayload = await readDemoWorkspaceStoredDocument({ documentId, tenderId });

  if (!demoPayload) {
    return null;
  }

  return {
    ...demoPayload,
    mode: "demo-public"
  };
}
