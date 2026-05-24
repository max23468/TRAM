import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { assertSafeObjectKey } from "../storage";
import type {
  BuildDocumentPackageInventoryInput,
  DocumentPackageInventory,
  IngestionFileRecord,
  IngestionFileStatus,
  ParserIssue,
  ParserKind
} from "./types";

const parserByExtension: Record<string, { contentType: string; parserKind: ParserKind }> = {
  ".csv": { contentType: "text/csv", parserKind: "text" },
  ".docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    parserKind: "docx"
  },
  ".md": { contentType: "text/markdown", parserKind: "text" },
  ".mpp": { contentType: "application/vnd.ms-project", parserKind: "mpp" },
  ".pdf": { contentType: "application/pdf", parserKind: "pdf" },
  ".txt": { contentType: "text/plain", parserKind: "text" },
  ".xls": { contentType: "application/vnd.ms-excel", parserKind: "legacy_spreadsheet" },
  ".xlsx": {
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    parserKind: "spreadsheet"
  }
};

export function toSafeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizeRelativePath(rootPath: string, filePath: string) {
  return path.relative(rootPath, filePath).split(path.sep).join("/");
}

function isUnsafeRelativePath(relativePath: string) {
  return (
    !relativePath ||
    relativePath.startsWith("/") ||
    relativePath.includes("..") ||
    relativePath.includes("\\")
  );
}

function getParserPlan(extension: string) {
  return (
    parserByExtension[extension] ?? {
      contentType: "application/octet-stream",
      parserKind: "unknown" as const
    }
  );
}

function getStatus(parserKind: ParserKind, sizeBytes: number, issues: ParserIssue[]): IngestionFileStatus {
  if (issues.some((issue) => issue.severity === "blocking")) {
    return sizeBytes === 0 ? "empty_file" : "blocked";
  }

  if (parserKind === "unknown") {
    return "unsupported";
  }

  if (parserKind === "pdf") {
    return "needs_ocr_check";
  }

  return "ready_for_parser";
}

function buildStorageKey({
  extension,
  fileName,
  packageId,
  sha256,
  tenderId
}: {
  extension: string;
  fileName: string;
  packageId: string;
  sha256: string;
  tenderId: string;
}) {
  const safeTenderId = toSafeSegment(tenderId);
  const safePackageId = toSafeSegment(packageId);
  const safeBaseName = toSafeSegment(path.basename(fileName, extension)) || "document";
  const key = `tenders/${safeTenderId}/packages/${safePackageId}/documents/${sha256.slice(
    0,
    16
  )}-${safeBaseName}${extension}`;

  assertSafeObjectKey(key);

  return key;
}

async function walkFiles(rootPath: string): Promise<string[]> {
  const entries = await readdir(rootPath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootPath, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(fullPath);
      }

      return entry.isFile() ? [fullPath] : [];
    })
  );

  return nested.flat().sort((left, right) => left.localeCompare(right));
}

async function buildFileRecord({
  filePath,
  input,
  rootPath
}: {
  filePath: string;
  input: BuildDocumentPackageInventoryInput;
  rootPath: string;
}): Promise<IngestionFileRecord> {
  const relativePath = normalizeRelativePath(rootPath, filePath);
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).toLowerCase();
  const [fileStat, body] = await Promise.all([stat(filePath), readFile(filePath)]);
  const sha256 = createHash("sha256").update(body).digest("hex");
  const parserPlan = getParserPlan(extension);
  const issues: ParserIssue[] = [];

  if (isUnsafeRelativePath(relativePath)) {
    issues.push({
      code: "unsafe_relative_path",
      message: "Path relativo non sicuro: il file non può entrare nell’inventario.",
      severity: "blocking"
    });
  }

  if (fileStat.size === 0) {
    issues.push({
      code: "empty_file",
      message: "File vuoto: il parser non può produrre fonti verificabili.",
      severity: "blocking"
    });
  }

  if (parserPlan.parserKind === "unknown") {
    issues.push({
      code: "unsupported_extension",
      message: "Estensione non supportata dalla pipeline documentale MVP.",
      severity: "blocking"
    });
  }

  if (parserPlan.parserKind === "pdf") {
    issues.push({
      code: "parser_requires_ocr_check",
      message: "PDF da verificare: potrebbe richiedere OCR prima delle source reference.",
      severity: "info"
    });
  }

  const status = getStatus(parserPlan.parserKind, fileStat.size, issues);

  return {
    id: `ing_${sha256.slice(0, 16)}`,
    tenderId: input.tenderId,
    packageId: input.packageId,
    relativePath,
    fileName,
    extension: extension || "none",
    sizeBytes: fileStat.size,
    sha256,
    contentType: parserPlan.contentType,
    parserKind: parserPlan.parserKind,
    status,
    storageKey: buildStorageKey({
      extension,
      fileName,
      packageId: input.packageId,
      sha256,
      tenderId: input.tenderId
    }),
    issues
  };
}

export async function buildDocumentPackageInventory(
  input: BuildDocumentPackageInventoryInput
): Promise<DocumentPackageInventory> {
  const rootPath = path.resolve(input.rootPath);
  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error("La root del pacchetto documentale deve essere una directory.");
  }

  const files = await Promise.all(
    (await walkFiles(rootPath)).map((filePath) => buildFileRecord({ filePath, input, rootPath }))
  );
  const blockingFiles = files.filter((file) =>
    file.issues.some((issue) => issue.severity === "blocking")
  );
  const issues: ParserIssue[] =
    blockingFiles.length === 0
      ? []
      : [
          {
            code: "unsupported_extension",
            message: `${blockingFiles.length} file richiedono review prima del parsing.`,
            severity: "warning"
          }
        ];

  return {
    tenderId: input.tenderId,
    packageId: input.packageId,
    packageLabel: input.packageLabel,
    rootLabel: input.rootLabel ?? path.basename(rootPath),
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    fileCount: files.length,
    totalSizeBytes: files.reduce((total, file) => total + file.sizeBytes, 0),
    files,
    issues
  };
}
