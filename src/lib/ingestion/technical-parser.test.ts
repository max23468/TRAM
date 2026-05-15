import { describe, expect, it } from "vitest";
import { parseTechnicalMetadata, type IngestionFileRecord } from ".";

function file(overrides: Partial<IngestionFileRecord>): IngestionFileRecord {
  return {
    id: "ing_test",
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    relativePath: "documents/test.pdf",
    fileName: "test.pdf",
    extension: ".pdf",
    sizeBytes: 10,
    sha256: "a".repeat(64),
    contentType: "application/pdf",
    parserKind: "pdf",
    status: "needs_ocr_check",
    storageKey: "tenders/tender_fx_cop_metro_om/packages/package_fx_001/documents/test.pdf",
    issues: [],
    ...overrides
  };
}

describe("technical document parser metadata", () => {
  it("estrae metadati tecnici PDF senza contenuto integrale", () => {
    const body = new TextEncoder().encode(
      "%PDF-1.7\n1 0 obj\n<< /Type /Page >>\nendobj\n2 0 obj\n<< /Type /Page >>\nendobj"
    );
    const result = parseTechnicalMetadata({ body, file: file({}) });

    expect(result).toMatchObject({
      contentSignature: "pdf",
      pageCount: 2,
      parserKind: "pdf",
      status: "needs_ocr_check"
    });
    expect(JSON.stringify(result)).not.toContain("1 0 obj");
  });

  it("riconosce container Office moderni e mantiene parsing limitato", () => {
    const body = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
    const result = parseTechnicalMetadata({
      body,
      file: file({
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: ".xlsx",
        fileName: "prices.xlsx",
        parserKind: "spreadsheet",
        status: "ready_for_parser"
      })
    });

    expect(result).toMatchObject({
      containerKind: "zip",
      contentSignature: "zip_office",
      parserKind: "spreadsheet",
      status: "metadata_extracted"
    });
    expect(result.issues.map((issue) => issue.code)).toContain("parser_metadata_limited");
  });

  it("riconosce container binari legacy per XLS/MPP", () => {
    const body = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00]);
    const result = parseTechnicalMetadata({
      body,
      file: file({
        contentType: "application/vnd.ms-project",
        extension: ".mpp",
        fileName: "schedule.mpp",
        parserKind: "mpp",
        status: "ready_for_parser"
      })
    });

    expect(result).toMatchObject({
      containerKind: "compound_binary",
      contentSignature: "compound_binary",
      parserKind: "mpp",
      status: "metadata_extracted"
    });
  });

  it("conta righe per testo e blocca firme incoerenti", () => {
    const textResult = parseTechnicalMetadata({
      body: new TextEncoder().encode("A,B\n1,2\n3,4"),
      file: file({
        contentType: "text/csv",
        extension: ".csv",
        fileName: "questions.csv",
        parserKind: "text",
        status: "ready_for_parser"
      })
    });

    expect(textResult).toMatchObject({
      contentSignature: "text",
      lineCount: 3,
      status: "metadata_extracted"
    });

    const invalidPdf = parseTechnicalMetadata({
      body: new TextEncoder().encode("not a pdf"),
      file: file({})
    });

    expect(invalidPdf.status).toBe("blocked");
    expect(invalidPdf.issues.map((issue) => issue.code)).toContain("invalid_file_signature");
  });
});
