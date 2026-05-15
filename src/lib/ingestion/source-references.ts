import type {
  DocumentPackageInventory,
  IngestionFileRecord,
  ParserIssueCode,
  TechnicalParseResult,
  TechnicalSourceReference,
  TechnicalSourceReferenceReviewStatus
} from "./types";

function sourceId(file: IngestionFileRecord, locator: string) {
  return `src_${file.id}_${locator.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase()}`;
}

function getReviewStatus(result: TechnicalParseResult): TechnicalSourceReferenceReviewStatus {
  if (result.status === "blocked" || result.status === "unsupported") {
    return "blocked";
  }

  if (result.status === "needs_ocr_check") {
    return "needs_review";
  }

  return "not_required";
}

function getIssueCodes(result: TechnicalParseResult): ParserIssueCode[] {
  return [...new Set(result.issues.map((issue) => issue.code))];
}

function baseReference({
  file,
  inventory,
  result
}: {
  file: IngestionFileRecord;
  inventory: DocumentPackageInventory;
  result: TechnicalParseResult;
}) {
  return {
    tenderId: inventory.tenderId,
    packageId: inventory.packageId,
    fileId: file.id,
    fileName: file.fileName,
    parserKind: file.parserKind,
    reviewStatus: getReviewStatus(result),
    issueCodes: getIssueCodes(result)
  };
}

export function buildPreliminarySourceReferences({
  inventory,
  parseResults
}: {
  inventory: DocumentPackageInventory;
  parseResults: TechnicalParseResult[];
}): TechnicalSourceReference[] {
  const resultByFileId = new Map(parseResults.map((result) => [result.fileId, result]));
  const references: TechnicalSourceReference[] = [];

  for (const file of inventory.files) {
    const result = resultByFileId.get(file.id);

    if (!result) {
      continue;
    }

    const base = baseReference({ file, inventory, result });

    if (result.parserKind === "pdf" && result.pageCount && result.pageCount > 0) {
      for (let page = 1; page <= result.pageCount; page += 1) {
        references.push({
          ...base,
          id: sourceId(file, `page-${page}`),
          label: `${file.fileName}, p. ${page}`,
          locator: `page:${page}`,
          locatorType: "page"
        });
      }
      continue;
    }

    if (result.parserKind === "text" && result.lineCount && result.lineCount > 0) {
      references.push({
        ...base,
        id: sourceId(file, `lines-1-${result.lineCount}`),
        label: `${file.fileName}, righe 1-${result.lineCount}`,
        locator: `lines:1-${result.lineCount}`,
        locatorType: "line_range"
      });
      continue;
    }

    if (result.containerKind) {
      references.push({
        ...base,
        id: sourceId(file, result.containerKind),
        label: `${file.fileName}, container ${result.containerKind}`,
        locator: `container:${result.containerKind}`,
        locatorType: "container"
      });
      continue;
    }

    references.push({
      ...base,
      id: sourceId(file, "file"),
      label: file.fileName,
      locator: `file:${file.relativePath}`,
      locatorType: "file"
    });
  }

  return references;
}
