import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createStorageDriver } from "../storage";
import type {
  LocalTenderDocument,
  LocalTenderDocumentStatus,
  LocalTenderPrivacy,
  LocalTenderReviewItem,
  LocalTenderReviewRisk,
  LocalTenderReviewStatus,
  LocalTenderSummary,
  LocalTenderWorkspace
} from "./types";

type UploadedTenderFile = {
  arrayBuffer(): Promise<ArrayBuffer>;
  name: string;
  size: number;
  type: string;
};

export type CreateLocalTenderInput = {
  authority: string;
  city: string;
  files: UploadedTenderFile[];
  name: string;
  notes: string;
  owner: string;
  packageReference: string;
  privacy: LocalTenderPrivacy;
  stage: string;
};

const workspaceRoot = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  ".local/tram-workspace"
);
const tendersRoot = path.join(workspaceRoot, "tenders");

const parserByExtension: Record<
  string,
  { contentType: string; parserLabel: string; status: LocalTenderDocumentStatus }
> = {
  ".csv": { contentType: "text/csv", parserLabel: "Tabella CSV", status: "Pronto per il parsing" },
  ".docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    parserLabel: "Documento Word",
    status: "Pronto per il parsing"
  },
  ".md": { contentType: "text/markdown", parserLabel: "Testo", status: "Pronto per il parsing" },
  ".mpp": { contentType: "application/vnd.ms-project", parserLabel: "Project", status: "Pronto per il parsing" },
  ".pdf": { contentType: "application/pdf", parserLabel: "PDF", status: "Verifica OCR" },
  ".txt": { contentType: "text/plain", parserLabel: "Testo", status: "Pronto per il parsing" },
  ".xls": {
    contentType: "application/vnd.ms-excel",
    parserLabel: "Workbook legacy",
    status: "Pronto per il parsing"
  },
  ".xlsx": {
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    parserLabel: "Workbook",
    status: "Pronto per il parsing"
  }
};

function safeSegment(value: string, fallback = "item") {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || fallback
  );
}

function workspacePath(tenderId: string) {
  return path.join(tendersRoot, `${safeSegment(tenderId)}.json`);
}

function parsePrivacy(value: string): LocalTenderPrivacy {
  if (value === "Documenti pubblici" || value === "Accesso ristretto") {
    return value;
  }

  return "Uso interno";
}

function getParserPlan(extension: string, fallbackType: string) {
  return (
    parserByExtension[extension] ?? {
      contentType: fallbackType || "application/octet-stream",
      parserLabel: "Formato non supportato",
      status: "Non supportato" as const
    }
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 102.4) / 10} KB`;
  }

  return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
}

function getReviewRisk(status: LocalTenderDocumentStatus): LocalTenderReviewRisk {
  if (status === "Non supportato" || status === "File vuoto") {
    return "Alto";
  }

  if (status === "Verifica OCR") {
    return "Medio";
  }

  return "Basso";
}

function reviewItemFromDocument(
  document: LocalTenderDocument,
  createdAt: string
): LocalTenderReviewItem | null {
  if (document.status === "Pronto per il parsing") {
    return null;
  }

  return {
    createdAt,
    documentId: document.id,
    id: `rev_${document.id}`,
    reason:
      document.status === "Verifica OCR"
        ? "Il PDF può richiedere OCR prima di produrre fonti affidabili."
        : document.issues.join(" "),
    risk: getReviewRisk(document.status),
    status: "Aperto",
    title: `${document.fileName}: ${document.status.toLowerCase()}`
  };
}

async function readWorkspaceFile(filePath: string): Promise<LocalTenderWorkspace | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as LocalTenderWorkspace;
  } catch {
    return null;
  }
}

async function writeWorkspace(workspace: LocalTenderWorkspace) {
  await mkdir(tendersRoot, { recursive: true });
  await writeFile(workspacePath(workspace.tender.id), JSON.stringify(workspace, null, 2));
}

export function normalizeLocalTenderInput(input: CreateLocalTenderInput): CreateLocalTenderInput {
  return {
    ...input,
    authority: input.authority.trim(),
    city: input.city.trim(),
    name: input.name.trim() || "Nuova gara",
    notes: input.notes.trim(),
    owner: input.owner.trim(),
    packageReference: input.packageReference.trim(),
    privacy: parsePrivacy(input.privacy),
    stage: input.stage.trim() || "Gara"
  };
}

export async function createLocalTenderWorkspace(input: CreateLocalTenderInput) {
  const normalized = normalizeLocalTenderInput(input);
  const now = new Date().toISOString();
  const tenderId = `local_${safeSegment(normalized.name)}_${Date.now().toString(36)}`;
  const packageId = `package_${Date.now().toString(36)}`;
  const storage = createStorageDriver();
  const documents = await Promise.all(
    normalized.files.map(async (file, index): Promise<LocalTenderDocument> => {
      const body = new Uint8Array(await file.arrayBuffer());
      const extension = path.extname(file.name).toLowerCase();
      const parserPlan = getParserPlan(extension, file.type);
      const sha256 = createHash("sha256").update(body).digest("hex");
      const status: LocalTenderDocumentStatus =
        file.size === 0 ? "File vuoto" : parserPlan.status;
      const issues: string[] = [];

      if (status === "File vuoto") {
        issues.push("File vuoto: non può produrre fonti verificabili.");
      }

      if (status === "Non supportato") {
        issues.push("Formato non supportato dalla pipeline locale dell’MVP.");
      }

      if (status === "Verifica OCR") {
        issues.push("PDF da controllare: può richiedere OCR.");
      }

      const safeName = safeSegment(path.basename(file.name, extension), "documento");
      const storageKey = `tenders/${tenderId}/packages/${packageId}/documents/${sha256.slice(
        0,
        16
      )}-${safeName}${extension}`;

      await storage.putObject({
        body,
        contentType: parserPlan.contentType,
        key: storageKey,
        metadata: {
          fileName: file.name,
          packageId,
          tenderId
        }
      });

      return {
        contentType: parserPlan.contentType,
        extension: extension || "none",
        fileName: file.name,
        id: `doc_${sha256.slice(0, 16)}_${index}`,
        issues,
        parserLabel: parserPlan.parserLabel,
        relativePath: file.name,
        sha256,
        sizeBytes: file.size,
        status,
        storageKey
      };
    })
  );

  const reviewItems = documents
    .map((document) => reviewItemFromDocument(document, now))
    .filter((item): item is LocalTenderReviewItem => Boolean(item));

  if (documents.length === 0) {
    reviewItems.push({
      createdAt: now,
      id: `rev_empty_${randomUUID()}`,
      reason: "La gara è stata creata senza documenti: serve caricare un pacchetto prima del controllo.",
      risk: "Alto",
      status: "Aperto",
      title: "Caricare documenti di gara"
    });
  }

  const workspace: LocalTenderWorkspace = {
    auditEvents: [
      {
        at: now,
        id: `audit_${randomUUID()}`,
        label:
          documents.length > 0
            ? `Creato inventario locale con ${documents.length} file (${formatBytes(
                documents.reduce((total, document) => total + document.sizeBytes, 0)
              )}).`
            : "Creata gara locale senza documenti.",
        status: documents.length > 0 ? "Completato" : "Da controllare"
      }
    ],
    createdAt: now,
    documents,
    package: {
      fileCount: documents.length,
      id: packageId,
      label: normalized.packageReference || `Pacchetto locale ${new Date(now).toLocaleDateString("it-IT")}`,
      totalSizeBytes: documents.reduce((total, document) => total + document.sizeBytes, 0)
    },
    reviewItems,
    tender: {
      authority: normalized.authority,
      city: normalized.city,
      id: tenderId,
      name: normalized.name,
      notes: normalized.notes,
      owner: normalized.owner,
      privacy: normalized.privacy,
      stage: normalized.stage
    },
    updatedAt: now,
    version: 1
  };

  await writeWorkspace(workspace);
  return workspace;
}

export async function readLocalTenderWorkspace(tenderId: string) {
  return readWorkspaceFile(workspacePath(tenderId));
}

export async function readLocalTenderStoredDocument({
  documentId,
  tenderId
}: {
  documentId: string;
  tenderId: string;
}) {
  const workspace = await readLocalTenderWorkspace(tenderId);

  if (!workspace) {
    return null;
  }

  const document = workspace.documents.find((item) => item.id === documentId);

  if (!document) {
    return null;
  }

  try {
    const storage = createStorageDriver();
    const body = await storage.getObject(document.storageKey);

    return {
      body,
      document,
      workspace
    };
  } catch {
    return null;
  }
}

async function listLocalTenderWorkspaces() {
  try {
    const entries = await readdir(tendersRoot, { withFileTypes: true });
    const workspaceReads = entries.reduce<Promise<LocalTenderWorkspace | null>[]>(
      (reads, entry) =>
        entry.isFile() && entry.name.endsWith(".json")
          ? [...reads, readWorkspaceFile(path.join(tendersRoot, entry.name))]
          : reads,
      []
    );
    const workspaces = await Promise.all(workspaceReads);

    return workspaces
      .filter((workspace): workspace is LocalTenderWorkspace => Boolean(workspace))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } catch {
    return [];
  }
}

export async function listLocalTenderSummaries(): Promise<LocalTenderSummary[]> {
  const workspaces = await listLocalTenderWorkspaces();

  return workspaces.map((workspace) => {
    const openReviewCount = workspace.reviewItems.filter((item) => item.status !== "Chiuso").length;

    return {
      authority: workspace.tender.authority,
      createdAt: workspace.createdAt,
      documentCount: workspace.documents.length,
      id: workspace.tender.id,
      name: workspace.tender.name,
      openReviewCount,
      owner: workspace.tender.owner,
      privacy: workspace.tender.privacy,
      stage: workspace.tender.stage,
      statusLabel:
        openReviewCount > 0
          ? "Da controllare"
          : workspace.documents.length > 0
            ? "Inventario pronto"
            : "Documenti mancanti",
      totalSizeBytes: workspace.package.totalSizeBytes,
      updatedAt: workspace.updatedAt
    };
  });
}

export async function updateLocalReviewItemStatus({
  reviewItemId,
  status,
  tenderId
}: {
  reviewItemId: string;
  status: LocalTenderReviewStatus;
  tenderId: string;
}) {
  const workspace = await readLocalTenderWorkspace(tenderId);

  if (!workspace) {
    return null;
  }

  const nextWorkspace: LocalTenderWorkspace = {
    ...workspace,
    auditEvents: [
      {
        at: new Date().toISOString(),
        id: `audit_${randomUUID()}`,
        label: `Controllo aggiornato: ${status}.`,
        status: "Completato"
      },
      ...workspace.auditEvents
    ],
    reviewItems: workspace.reviewItems.map((item) =>
      item.id === reviewItemId ? { ...item, status } : item
    ),
    updatedAt: new Date().toISOString()
  };

  await writeWorkspace(nextWorkspace);
  return nextWorkspace;
}
