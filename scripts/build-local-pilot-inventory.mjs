import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const parserByExtension = {
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

function usage() {
  console.error(
    "Usage: npm run pilot:inventory -- <package-root> <package-id> <tender-id> [package-label]"
  );
}

function toSafeSegment(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function increment(record, key, by = 1) {
  record[key] = (record[key] ?? 0) + by;
}

function normalizeRelativePath(rootPath, filePath) {
  return path.relative(rootPath, filePath).split(path.sep).join("/");
}

function assertAllowedInput(rootPath) {
  const relative = path.relative(process.cwd(), rootPath).split(path.sep).join("/");

  if (!relative.startsWith("data/packages/") && !relative.startsWith("data/working/")) {
    throw new Error("Il pacchetto pilot deve stare sotto data/packages o data/working.");
  }
}

function getParserPlan(extension) {
  return parserByExtension[extension] ?? {
    contentType: "application/octet-stream",
    parserKind: "unknown"
  };
}

function getStatus({ parserKind, sizeBytes }) {
  if (sizeBytes === 0) {
    return "empty_file";
  }

  if (parserKind === "unknown") {
    return "unsupported";
  }

  if (parserKind === "pdf") {
    return "needs_ocr_check";
  }

  return "ready_for_parser";
}

async function walkFiles(rootPath) {
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

async function buildRecord({ filePath, packageId, rootPath, tenderId }) {
  const relativePath = normalizeRelativePath(rootPath, filePath);
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).toLowerCase();
  const fileStat = await stat(filePath);
  const body = await readFile(filePath);
  const sha256 = createHash("sha256").update(body).digest("hex");
  const parserPlan = getParserPlan(extension);
  const status = getStatus({ parserKind: parserPlan.parserKind, sizeBytes: fileStat.size });
  const issueCodes = [];

  if (fileStat.size === 0) {
    issueCodes.push("empty_file");
  }

  if (parserPlan.parserKind === "unknown") {
    issueCodes.push("unsupported_extension");
  }

  if (parserPlan.parserKind === "pdf") {
    issueCodes.push("parser_requires_ocr_check");
  }

  return {
    id: `pilot_${sha256.slice(0, 16)}`,
    tenderId,
    packageId,
    relativePath,
    fileName,
    extension: extension || "none",
    sizeBytes: fileStat.size,
    sha256,
    contentType: parserPlan.contentType,
    parserKind: parserPlan.parserKind,
    status,
    issueCodes
  };
}

function buildSummary({ files, generatedAt, packageId, packageLabel, rootLabel, tenderId }) {
  const extensionCounts = {};
  const issueCounts = {};
  const parserKindCounts = {};
  const statusCounts = {};
  const topLevelFolderCounts = {};

  for (const file of files) {
    increment(extensionCounts, file.extension);
    increment(parserKindCounts, file.parserKind);
    increment(statusCounts, file.status);
    increment(topLevelFolderCounts, file.relativePath.split("/")[0] ?? "[root]");

    for (const issueCode of file.issueCodes) {
      increment(issueCounts, issueCode);
    }
  }

  return {
    generatedAt,
    tenderId,
    packageId,
    packageLabel,
    rootLabel,
    fileCount: files.length,
    totalSizeBytes: files.reduce((total, file) => total + file.sizeBytes, 0),
    extensionCounts,
    parserKindCounts,
    statusCounts,
    issueCounts,
    topLevelFolderCounts
  };
}

const [rootArg, packageIdArg, tenderIdArg, ...packageLabelParts] = process.argv.slice(2);

if (!rootArg || !packageIdArg || !tenderIdArg) {
  usage();
  process.exit(2);
}

const rootPath = path.resolve(rootArg);
assertAllowedInput(rootPath);

const rootStat = await stat(rootPath);

if (!rootStat.isDirectory()) {
  throw new Error("La root del pacchetto pilot deve essere una directory.");
}

const packageId = toSafeSegment(packageIdArg);
const tenderId = toSafeSegment(tenderIdArg);
const packageLabel = packageLabelParts.join(" ") || packageIdArg;
const generatedAt = new Date().toISOString();
const outputDir = path.join(process.cwd(), "data", "working", packageId, "inventory");
const files = await Promise.all(
  (await walkFiles(rootPath)).map((filePath) =>
    buildRecord({ filePath, packageId, rootPath, tenderId })
  )
);
const inventory = {
  generatedAt,
  tenderId,
  packageId,
  packageLabel,
  rootLabel: path.basename(rootPath),
  fileCount: files.length,
  totalSizeBytes: files.reduce((total, file) => total + file.sizeBytes, 0),
  files
};
const summary = buildSummary({
  files,
  generatedAt,
  packageId,
  packageLabel,
  rootLabel: inventory.rootLabel,
  tenderId
});

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "local-pilot-inventory.json"),
  `${JSON.stringify(inventory, null, 2)}\n`
);
await writeFile(
  path.join(outputDir, "local-pilot-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`
);

console.log(
  JSON.stringify(
    {
      outputDir: path.relative(process.cwd(), outputDir),
      fileCount: summary.fileCount,
      extensionCounts: summary.extensionCounts,
      parserKindCounts: summary.parserKindCounts,
      statusCounts: summary.statusCounts,
      issueCounts: summary.issueCounts
    },
    null,
    2
  )
);
