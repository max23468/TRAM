import { describe, expect, it } from "vitest";
import {
  buildPreliminarySourceReferences,
  type DocumentPackageInventory,
  type IngestionFileRecord,
  type TechnicalParseResult
} from ".";

function file(overrides: Partial<IngestionFileRecord>): IngestionFileRecord {
  return {
    id: "ing_pdf",
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    relativePath: "documents/instructions.pdf",
    fileName: "instructions.pdf",
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

describe("preliminary technical source references", () => {
  it("crea source reference pagina per PDF con page count", () => {
    const pdf = file({});
    const refs = buildPreliminarySourceReferences({
      inventory: inventory([pdf]),
      parseResults: [
        {
          fileId: pdf.id,
          fileName: pdf.fileName,
          parserKind: "pdf",
          status: "needs_ocr_check",
          contentSignature: "pdf",
          pageCount: 2,
          issues: [
            {
              code: "parser_requires_ocr_check",
              message: "PDF da verificare",
              severity: "info"
            }
          ]
        }
      ]
    });

    expect(refs).toHaveLength(2);
    expect(refs[0]).toMatchObject({
      label: "instructions.pdf, p. 1",
      locator: "page:1",
      locatorType: "page",
      reviewStatus: "needs_review",
      issueCodes: ["parser_requires_ocr_check"]
    });
    expect(JSON.stringify(refs)).not.toContain("/Type /Page");
  });

  it("crea riferimenti container e line range senza estratti", () => {
    const xlsx = file({
      id: "ing_xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      extension: ".xlsx",
      fileName: "prices.xlsx",
      parserKind: "spreadsheet",
      relativePath: "pricing/prices.xlsx",
      status: "ready_for_parser"
    });
    const csv = file({
      id: "ing_csv",
      contentType: "text/csv",
      extension: ".csv",
      fileName: "qna.csv",
      parserKind: "text",
      relativePath: "qna/qna.csv",
      status: "ready_for_parser"
    });
    const parseResults: TechnicalParseResult[] = [
      {
        fileId: xlsx.id,
        fileName: xlsx.fileName,
        parserKind: "spreadsheet",
        status: "metadata_extracted",
        contentSignature: "zip_office",
        containerKind: "zip",
        issues: [
          {
            code: "parser_metadata_limited",
            message: "Parser limitato",
            severity: "info"
          }
        ]
      },
      {
        fileId: csv.id,
        fileName: csv.fileName,
        parserKind: "text",
        status: "metadata_extracted",
        contentSignature: "text",
        lineCount: 12,
        issues: []
      }
    ];

    const refs = buildPreliminarySourceReferences({
      inventory: inventory([xlsx, csv]),
      parseResults
    });

    expect(refs).toEqual([
      expect.objectContaining({
        fileId: xlsx.id,
        locator: "container:zip",
        locatorType: "container",
        reviewStatus: "not_required"
      }),
      expect.objectContaining({
        fileId: csv.id,
        locator: "lines:1-12",
        locatorType: "line_range",
        reviewStatus: "not_required"
      })
    ]);
  });

  it("crea riferimento file bloccante per parser issue", () => {
    const unsupported = file({
      id: "ing_unsupported",
      extension: ".exe",
      fileName: "tool.exe",
      parserKind: "unknown",
      relativePath: "tool.exe",
      status: "blocked"
    });
    const refs = buildPreliminarySourceReferences({
      inventory: inventory([unsupported]),
      parseResults: [
        {
          fileId: unsupported.id,
          fileName: unsupported.fileName,
          parserKind: "unknown",
          status: "blocked",
          contentSignature: "unknown",
          issues: [
            {
              code: "unsupported_extension",
              message: "Formato non supportato",
              severity: "blocking"
            }
          ]
        }
      ]
    });

    expect(refs).toEqual([
      expect.objectContaining({
        fileId: unsupported.id,
        locator: "file:tool.exe",
        locatorType: "file",
        reviewStatus: "blocked",
        issueCodes: ["unsupported_extension"]
      })
    ]);
  });
});
