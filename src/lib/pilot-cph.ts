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

export type CphPilotPriority = "critical" | "high" | "normal";

export type CphPilotDocumentVersion = PilotInventoryFile & {
  areaId: string;
  areaLabel: string;
  documentCode: string | null;
  familyKey: string;
  familyLabel: string;
  formatLabel: string;
  isTrackChanges: boolean;
  shortTitle: string;
  versionLabel: string;
  versionNumber: number | null;
};

export type CphPilotDocumentGroup = {
  id: string;
  areaId: string;
  areaLabel: string;
  currentVersion: CphPilotDocumentVersion;
  documentCode: string | null;
  familyKey: string;
  familyLabel: string;
  formats: string[];
  hasTrackChanges: boolean;
  priority: CphPilotPriority;
  reviewFocus: string;
  sourceTextVersion: CphPilotDocumentVersion | null;
  title: string;
  versions: CphPilotDocumentVersion[];
};

type FamilyInfo = {
  key: string;
  label: string;
  priority: CphPilotPriority;
  reviewFocus: string;
};

const formatLabels: Record<string, string> = {
  ".docx": "DOCX",
  ".mpp": "MPP",
  ".pdf": "PDF",
  ".xls": "XLS",
  ".xlsx": "XLSX"
};

const familyOrder = [
  "procurement_schedule",
  "instructions",
  "schedule_prices",
  "conditions_contract",
  "contract_specification",
  "form_tender",
  "commitment_letters",
  "subcontractors",
  "payment_mechanism",
  "traffic_operations",
  "passenger_information",
  "maintenance",
  "transition",
  "data_processing",
  "general"
];

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "documento";
}

function inferDocumentCode(fileName: string) {
  return fileName.match(/CM-X-OMRT3-TD-\d+/i)?.[0].toUpperCase() ?? null;
}

function inferVersion(fileName: string) {
  const versionMatch = fileName.match(/\bv(\d+(?:\.\d+)?)\b/i);

  if (versionMatch?.[1]) {
    return {
      label: `v${versionMatch[1]}`,
      number: Number(versionMatch[1])
    };
  }

  const codeVersionMatch = fileName.match(/CM-X-OMRT3-TD-\d+[_ -]+(\d+(?:\.\d+)?)/i);

  if (codeVersionMatch?.[1]) {
    return {
      label: `v${codeVersionMatch[1]}`,
      number: Number(codeVersionMatch[1])
    };
  }

  return {
    label: "versione non indicata",
    number: null
  };
}

function inferArea(file: PilotInventoryFile) {
  const topLevelFolder = getTopLevelFolder(file);

  if (topLevelFolder.startsWith("a.")) {
    return {
      id: "tender-documents",
      label: "A · Documenti gara"
    };
  }

  if (topLevelFolder.startsWith("b.")) {
    return {
      id: "contract-conditions",
      label: "B · Condizioni"
    };
  }

  if (topLevelFolder.startsWith("c.")) {
    return {
      id: "contract-specifications",
      label: "C · Specifiche"
    };
  }

  return {
    id: "root",
    label: topLevelFolder
  };
}

function inferFamily(file: PilotInventoryFile): FamilyInfo {
  const searchableName = file.fileName.toLowerCase();

  if (file.extension === ".mpp" || searchableName.includes("procurement schedule")) {
    return {
      key: "procurement_schedule",
      label: "Timeline e calendario procedura",
      priority: "critical",
      reviewFocus: "Verificare date, milestone, versione corrente e possibili conflitti tra PDF e MPP."
    };
  }

  if (
    searchableName.includes("instructions to tender") ||
    searchableName.includes("instruction to tender")
  ) {
    return {
      key: "instructions",
      label: "Istruzioni ai concorrenti",
      priority: "critical",
      reviewFocus: "Punto di ingresso per regole di submission, chiarimenti, scadenze e requisiti formali."
    };
  }

  if (searchableName.includes("schedule of prices")) {
    return {
      key: "schedule_prices",
      label: "Prezzi e modello economico",
      priority: "high",
      reviewFocus: "Aprire il workbook, non consolidare importi o formule senza review umana."
    };
  }

  if (searchableName.includes("data processing") || searchableName.includes("personal data")) {
    return {
      key: "data_processing",
      label: "Dati personali e processing",
      priority: "high",
      reviewFocus: "Individuare vincoli privacy e limiti all’uso di provider esterni."
    };
  }

  if (
    searchableName.includes("subcontractor") ||
    searchableName.includes("sub-contractor") ||
    searchableName.includes("subscontractor")
  ) {
    return {
      key: "subcontractors",
      label: "Subappaltatori",
      priority: "normal",
      reviewFocus: "Verificare ruoli, dichiarazioni richieste e collegamento ai moduli di offerta."
    };
  }

  if (searchableName.includes("conditions of contract")) {
    return {
      key: "conditions_contract",
      label: "Condizioni contrattuali",
      priority: "high",
      reviewFocus: "Individuare obblighi, allocazione rischi, penali e punti da chiarire."
    };
  }

  if (searchableName.includes("contract specification")) {
    return {
      key: "contract_specification",
      label: "Specifiche contrattuali",
      priority: "high",
      reviewFocus: "Mappare requisiti O&M, KPI, obblighi operativi e riferimenti agli allegati."
    };
  }

  if (searchableName.includes("form of tender")) {
    return {
      key: "form_tender",
      label: "Modulo di offerta",
      priority: "high",
      reviewFocus: "Verificare dichiarazioni, firme, vincoli formali e dipendenze dagli altri moduli."
    };
  }

  if (searchableName.includes("commitment letter")) {
    return {
      key: "commitment_letters",
      label: "Lettere di impegno",
      priority: "normal",
      reviewFocus: "Controllare firma, soggetto, obbligatorietà e coerenza con i requisiti di submission."
    };
  }

  if (searchableName.includes("payment mechanism")) {
    return {
      key: "payment_mechanism",
      label: "Payment mechanism",
      priority: "high",
      reviewFocus: "Trattare formule, incentivi e deduzioni come dati critici da validare."
    };
  }

  if (
    searchableName.includes("traffic control") ||
    searchableName.includes("operation") ||
    searchableName.includes("operational")
  ) {
    return {
      key: "traffic_operations",
      label: "Operazioni e traffico",
      priority: "normal",
      reviewFocus: "Mappare obblighi operativi, interfacce e requisiti di continuità del servizio."
    };
  }

  if (searchableName.includes("passenger") || searchableName.includes("customer")) {
    return {
      key: "passenger_information",
      label: "Passeggeri e customer experience",
      priority: "normal",
      reviewFocus: "Estrarre requisiti informativi, canali, qualità servizio e obblighi verso utenti."
    };
  }

  if (searchableName.includes("maintenance")) {
    return {
      key: "maintenance",
      label: "Manutenzione",
      priority: "normal",
      reviewFocus: "Collegare attività manutentive, standard, KPI e responsabilità operative."
    };
  }

  if (searchableName.includes("transition")) {
    return {
      key: "transition",
      label: "Transizione e avvio servizio",
      priority: "normal",
      reviewFocus: "Verificare attività pre-avvio, dipendenze, date e responsabilità."
    };
  }

  return {
    key: "general",
    label: "Documento di gara",
    priority: "normal",
    reviewFocus: "Classificare ruolo del documento e collegarlo a requisiti, date o moduli pertinenti."
  };
}

function cleanDocumentTitle(file: PilotInventoryFile, family: FamilyInfo) {
  const withoutExtension = file.fileName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExtension
    .replace(/^\d+\.\s*/, "")
    .replace(/CM-X-OMRT3-TD-\d+/gi, "")
    .replace(/\bv\d+(?:\.\d+)?\b/gi, "")
    .replace(/\btrack changes\b/gi, "")
    .replace(/\bpdf\b/gi, "")
    .replace(/\bdocx\b/gi, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+\d+(?:\.\d+)?\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || family.label;
}

function getGroupKey(file: PilotInventoryFile, family: FamilyInfo, title: string) {
  if (family.key === "procurement_schedule") {
    return family.key;
  }

  const documentCode = inferDocumentCode(file.fileName);

  return `${family.key}:${documentCode ?? slugify(title)}`;
}

function formatRank(version: CphPilotDocumentVersion) {
  if (version.familyKey === "procurement_schedule" && version.extension === ".mpp") {
    return 5;
  }

  if (version.familyKey === "schedule_prices" && [".xlsx", ".xls"].includes(version.extension)) {
    return 5;
  }

  if (version.extension === ".pdf") {
    return 4;
  }

  if (version.extension === ".docx") {
    return 3;
  }

  return 1;
}

function currentVersionScore(version: CphPilotDocumentVersion) {
  return (
    (version.versionNumber ?? 0) * 100 +
    formatRank(version) * 10 +
    (version.isTrackChanges ? 0 : 5)
  );
}

function versionSort(left: CphPilotDocumentVersion, right: CphPilotDocumentVersion) {
  return currentVersionScore(right) - currentVersionScore(left);
}

function groupSort(left: CphPilotDocumentGroup, right: CphPilotDocumentGroup) {
  const priorityScore: Record<CphPilotPriority, number> = {
    critical: 0,
    high: 1,
    normal: 2
  };
  const leftFamilyIndex = familyOrder.indexOf(left.familyKey);
  const rightFamilyIndex = familyOrder.indexOf(right.familyKey);

  return (
    priorityScore[left.priority] - priorityScore[right.priority] ||
    (leftFamilyIndex === -1 ? 99 : leftFamilyIndex) -
      (rightFamilyIndex === -1 ? 99 : rightFamilyIndex) ||
    left.title.localeCompare(right.title)
  );
}

export function buildCphPilotDocumentGroups(inventory: PilotInventory) {
  const buckets = new Map<string, CphPilotDocumentVersion[]>();

  for (const file of inventory.files) {
    const area = inferArea(file);
    const family = inferFamily(file);
    const title = cleanDocumentTitle(file, family);
    const version = inferVersion(file.fileName);
    const documentVersion: CphPilotDocumentVersion = {
      ...file,
      areaId: area.id,
      areaLabel: area.label,
      documentCode: inferDocumentCode(file.fileName),
      familyKey: family.key,
      familyLabel: family.label,
      formatLabel: formatLabels[file.extension] ?? file.extension.replace(".", "").toUpperCase(),
      isTrackChanges: /track changes/i.test(file.fileName),
      shortTitle: title,
      versionLabel: version.label,
      versionNumber: Number.isFinite(version.number) ? version.number : null
    };
    const groupKey = getGroupKey(file, family, title);
    buckets.set(groupKey, [...(buckets.get(groupKey) ?? []), documentVersion]);
  }

  return Array.from(buckets.entries())
    .map(([key, versions]) => {
      const sortedVersions = [...versions].sort(versionSort);
      const currentVersion = sortedVersions[0];
      const family = inferFamily(currentVersion);
      const sourceTextVersion =
        sortedVersions.find((version) => version.extension === ".pdf" && !version.isTrackChanges) ??
        sortedVersions.find((version) => version.extension === ".pdf") ??
        null;

      return {
        id: slugify(key),
        areaId: currentVersion.areaId,
        areaLabel: currentVersion.areaLabel,
        currentVersion,
        documentCode: currentVersion.documentCode,
        familyKey: family.key,
        familyLabel: family.label,
        formats: Array.from(new Set(sortedVersions.map((version) => version.formatLabel))),
        hasTrackChanges: sortedVersions.some((version) => version.isTrackChanges),
        priority: family.priority,
        reviewFocus: family.reviewFocus,
        sourceTextVersion,
        title: currentVersion.shortTitle,
        versions: sortedVersions
      } satisfies CphPilotDocumentGroup;
    })
    .sort(groupSort);
}
