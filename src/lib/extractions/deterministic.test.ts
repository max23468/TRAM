import { describe, expect, it } from "vitest";
import type { DocumentPackageInventory, IngestionFileRecord, TechnicalSourceReference } from "../ingestion";
import { extractAllDeterministicCandidates, extractT1T3Candidates, extractT4T8Candidates } from ".";

function file(overrides: Partial<IngestionFileRecord>): IngestionFileRecord {
  return {
    id: "ing_instructions",
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    relativePath: "a. Tender documents/Instructions to Tender.pdf",
    fileName: "Instructions to Tender.pdf",
    extension: ".pdf",
    sizeBytes: 100,
    sha256: "a".repeat(64),
    contentType: "application/pdf",
    parserKind: "pdf",
    status: "needs_ocr_check",
    storageKey: "tenders/tender_fx_cop_metro_om/packages/package_fx_001/documents/instructions.pdf",
    issues: [],
    ...overrides
  };
}

function source(fileRecord: IngestionFileRecord, overrides: Partial<TechnicalSourceReference> = {}): TechnicalSourceReference {
  return {
    id: `src_${fileRecord.id}`,
    tenderId: fileRecord.tenderId,
    packageId: fileRecord.packageId,
    fileId: fileRecord.id,
    fileName: fileRecord.fileName,
    locatorType: "file",
    locator: `file:${fileRecord.relativePath}`,
    label: fileRecord.fileName,
    parserKind: fileRecord.parserKind,
    reviewStatus: "not_required",
    issueCodes: [],
    ...overrides
  };
}

function inventory(files: IngestionFileRecord[]): DocumentPackageInventory {
  return {
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    packageLabel: "Pacchetto sintetico",
    rootLabel: "synthetic",
    generatedAt: "2026-05-15T12:00:00.000Z",
    fileCount: files.length,
    totalSizeBytes: files.reduce((total, item) => total + item.sizeBytes, 0),
    files,
    issues: []
  };
}

describe("deterministic T1-T3 extractors", () => {
  it("genera document envelope T1 per ogni file con fonte", () => {
    const instructions = file({});
    const price = file({
      id: "ing_price",
      fileName: "Schedule of Prices.xlsx",
      parserKind: "spreadsheet",
      relativePath: "pricing/Schedule of Prices.xlsx"
    });
    const candidates = extractT1T3Candidates({
      inventory: inventory([instructions, price]),
      sourceReferences: [source(instructions), source(price)]
    });

    expect(candidates.filter((candidate) => candidate.task === "T1")).toHaveLength(2);
    expect(candidates.every((candidate) => candidate.sourceReferenceId.length > 0)).toBe(true);
    expect(candidates.every((candidate) => candidate.aiPolicyStatus === "local_only")).toBe(true);
    expect(candidates.every((candidate) => !/[A-Z.:/]/.test(candidate.id))).toBe(true);
  });

  it("genera T2/T3 solo come candidati da review senza inventare date, formati o obbligatorietà", () => {
    const schedule = file({
      id: "ing_schedule",
      fileName: "Procurement Schedule.mpp",
      parserKind: "mpp",
      relativePath: "schedule/Procurement Schedule.mpp"
    });
    const instructions = file({});
    const candidates = extractT1T3Candidates({
      inventory: inventory([schedule, instructions]),
      sourceReferences: [source(schedule), source(instructions)]
    });

    const timeline = candidates.find((candidate) => candidate.task === "T2");
    const deliverable = candidates.find((candidate) => candidate.task === "T3");

    expect(timeline).toMatchObject({
      requiresReview: true,
      risk: "medium",
      status: "needs_review"
    });
    expect(timeline?.description).toContain("date, timezone, durate e conflitti restano");
    expect(JSON.stringify(timeline)).not.toMatch(/\b\d{4}-\d{2}-\d{2}\b/);

    expect(deliverable).toMatchObject({
      requiresReview: true,
      risk: "medium",
      status: "needs_review"
    });
    expect(deliverable?.description).toContain("obbligatorietà, formato e deadline non sono dedotti");
  });

  it("salta file senza source reference invece di creare claim non supportati", () => {
    const missingSource = file({ id: "ing_missing" });
    const candidates = extractT1T3Candidates({
      inventory: inventory([missingSource]),
      sourceReferences: []
    });

    expect(candidates).toEqual([]);
  });
});

describe("deterministic T4-T8 extractors", () => {
  it("genera requisiti, financials e cost driver solo come candidati review-first", () => {
    const contract = file({
      id: "ing_contract",
      fileName: "Contract Specifications Performance KPI.pdf",
      relativePath: "contract/Contract Specifications Performance KPI.pdf"
    });
    const payment = file({
      id: "ing_payment",
      fileName: "Attachment A Payment.xlsx",
      parserKind: "spreadsheet",
      relativePath: "pricing/Attachment A Payment.xlsx"
    });
    const candidates = extractT4T8Candidates({
      inventory: inventory([contract, payment]),
      sourceReferences: [source(contract), source(payment)]
    });

    expect(candidates.map((candidate) => candidate.task)).toEqual(
      expect.arrayContaining(["T4", "T5", "T6"])
    );
    expect(candidates.every((candidate) => candidate.requiresReview)).toBe(true);
    expect(candidates.find((candidate) => candidate.task === "T5")?.description).toContain(
      "nessun importo o formula"
    );
    expect(JSON.stringify(candidates)).not.toMatch(/€|eur|importo validato/i);
  });

  it("genera criticità da parser issue e Q&A senza invio automatico", () => {
    const blocked = file({
      id: "ing_blocked",
      fileName: "corrupted.bin",
      parserKind: "unknown",
      relativePath: "corrupted.bin",
      status: "blocked"
    });
    const qna = file({
      id: "ing_qna",
      fileName: "Clarification Register.csv",
      parserKind: "text",
      relativePath: "qna/Clarification Register.csv",
      status: "ready_for_parser"
    });
    const candidates = extractT4T8Candidates({
      inventory: inventory([blocked, qna]),
      sourceReferences: [
        source(blocked, {
          issueCodes: ["unsupported_extension"],
          reviewStatus: "blocked"
        }),
        source(qna)
      ]
    });

    expect(candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "needs_review", task: "T7" }),
        expect.objectContaining({ status: "needs_review", task: "T8" })
      ])
    );
    expect(candidates.find((candidate) => candidate.task === "T8")?.description).toContain(
      "nessuna domanda viene inviata"
    );
  });

  it("compone T1-T8 in un unico set deterministico source-based", () => {
    const files = [
      file({ id: "ing_schedule", fileName: "Procurement Schedule.mpp", parserKind: "mpp" }),
      file({ id: "ing_payment", fileName: "Payment.xlsx", parserKind: "spreadsheet" })
    ];
    const candidates = extractAllDeterministicCandidates({
      inventory: inventory(files),
      sourceReferences: files.map((item) => source(item))
    });

    expect(candidates.length).toBeGreaterThan(2);
    expect(candidates.every((candidate) => candidate.sourceReferenceId.startsWith("src_"))).toBe(
      true
    );
  });
});
