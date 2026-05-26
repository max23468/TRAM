export type LocalTenderPrivacy = "Documenti pubblici" | "Uso interno" | "Accesso ristretto";

export type LocalTenderDocumentStatus =
  | "Pronto per il parsing"
  | "Verifica OCR"
  | "Da controllare"
  | "Non supportato"
  | "File vuoto";

export type LocalTenderReviewStatus = "Aperto" | "In controllo" | "Chiuso";

export type LocalTenderReviewRisk = "Basso" | "Medio" | "Alto";

export type LocalTenderDocument = {
  contentType: string;
  extension: string;
  fileName: string;
  id: string;
  issues: string[];
  parserLabel: string;
  relativePath: string;
  sha256: string;
  sizeBytes: number;
  status: LocalTenderDocumentStatus;
  storageKey: string;
};

export type LocalTenderReviewItem = {
  createdAt: string;
  documentId?: string;
  id: string;
  reason: string;
  risk: LocalTenderReviewRisk;
  status: LocalTenderReviewStatus;
  title: string;
};

export type LocalTenderAuditEvent = {
  at: string;
  id: string;
  label: string;
  status: "Completato" | "Da controllare";
};

export type LocalTenderWorkspace = {
  createdAt: string;
  documents: LocalTenderDocument[];
  package: {
    fileCount: number;
    id: string;
    label: string;
    totalSizeBytes: number;
  };
  reviewItems: LocalTenderReviewItem[];
  tender: {
    authority: string;
    city: string;
    id: string;
    name: string;
    notes: string;
    owner: string;
    privacy: LocalTenderPrivacy;
    stage: string;
  };
  auditEvents: LocalTenderAuditEvent[];
  updatedAt: string;
  version: 1;
};

export type LocalTenderSummary = {
  authority: string;
  createdAt: string;
  documentCount: number;
  id: string;
  name: string;
  openReviewCount: number;
  owner: string;
  privacy: LocalTenderPrivacy;
  stage: string;
  statusLabel: string;
  totalSizeBytes: number;
  updatedAt: string;
};
