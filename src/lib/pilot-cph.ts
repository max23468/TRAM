import { readFile } from "node:fs/promises";
import path from "node:path";

export type PilotInventoryFile = {
  id: string;
  tenderId: string;
  packageId: string;
  relativePath: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  sha256: string;
  contentType: string;
  parserKind: string;
  status: string;
  issueCodes: string[];
};

export type PilotInventory = {
  generatedAt: string;
  tenderId: string;
  packageId: string;
  packageLabel: string;
  rootLabel: string;
  fileCount: number;
  totalSizeBytes: number;
  files: PilotInventoryFile[];
};

export type PilotSummary = {
  generatedAt: string;
  tenderId: string;
  packageId: string;
  packageLabel: string;
  rootLabel: string;
  fileCount: number;
  totalSizeBytes: number;
  extensionCounts: Record<string, number>;
  parserKindCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  issueCounts: Record<string, number>;
  topLevelFolderCounts: Record<string, number>;
};

export type PilotTextExtractSummary = {
  generatedAt: string;
  packageId: string;
  extractedCount: number;
  failedCount: number;
  skippedCount: number;
};

export const cphPackageId = "copenhagen-m1-m4-om";

const repoRoot = process.cwd();
const packageRoot = path.join(repoRoot, "data", "packages", cphPackageId);
const inventoryPath = path.join(
  repoRoot,
  "data",
  "working",
  cphPackageId,
  "inventory",
  "local-pilot-inventory.json"
);
const summaryPath = path.join(
  repoRoot,
  "data",
  "working",
  cphPackageId,
  "inventory",
  "local-pilot-summary.json"
);
const textExtractDir = path.join(repoRoot, "data", "working", cphPackageId, "text-extracts");
const textSummaryPath = path.join(textExtractDir, "summary.json");

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function getCphPilotInventory() {
  return readJson<PilotInventory>(inventoryPath);
}

export async function getCphPilotSummary() {
  return readJson<PilotSummary>(summaryPath);
}

export async function getCphTextExtractSummary() {
  return readJson<PilotTextExtractSummary>(textSummaryPath);
}

export async function getCphTextExtract(fileId: string) {
  if (!/^[a-z0-9._-]+$/i.test(fileId)) {
    return null;
  }

  try {
    return await readFile(path.join(textExtractDir, `${fileId}.txt`), "utf8");
  } catch {
    return null;
  }
}

export function resolveCphDocumentPath(file: PilotInventoryFile) {
  const resolvedPath = path.resolve(packageRoot, file.relativePath);

  if (!resolvedPath.startsWith(packageRoot)) {
    return null;
  }

  return resolvedPath;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function getTopLevelFolder(file: PilotInventoryFile) {
  return file.relativePath.split("/")[0] ?? "[root]";
}
