import { describe, expect, it } from "vitest";
import {
  buildDemoDocumentGroups,
  type DemoInventory,
  type DemoInventoryFile
} from "./demo-inventory";

function file(overrides: Partial<DemoInventoryFile>): DemoInventoryFile {
  return {
    id: overrides.id ?? "demo_test_file",
    tenderId: "tender_cph_m1_m4_om",
    packageId: "copenhagen-m1-m4-om",
    relativePath: overrides.relativePath ?? `a. Tender documents/${overrides.fileName}`,
    fileName: overrides.fileName ?? "Document.pdf",
    extension: overrides.extension ?? ".pdf",
    sizeBytes: overrides.sizeBytes ?? 1024,
    sha256: overrides.sha256 ?? "0".repeat(64),
    contentType: overrides.contentType ?? "application/pdf",
    parserKind: overrides.parserKind ?? "pdf",
    status: overrides.status ?? "needs_ocr_check",
    issueCodes: overrides.issueCodes ?? []
  };
}

function inventory(files: DemoInventoryFile[]): DemoInventory {
  return {
    generatedAt: "2026-05-16T12:00:00.000Z",
    tenderId: "tender_cph_m1_m4_om",
    packageId: "copenhagen-m1-m4-om",
    packageLabel: "CPH M1/M4 O&M",
    rootLabel: "copenhagen-m1-m4-om",
    fileCount: files.length,
    totalSizeBytes: files.reduce((total, item) => total + item.sizeBytes, 0),
    files
  };
}

describe("demo inventory document groups", () => {
  it("non classifica ogni file della cartella Conditions come condizioni contrattuali", () => {
    const groups = buildDemoDocumentGroups(
      inventory([
        file({
          id: "personal_data_pdf",
          relativePath:
            "b. Conditions of contract with appendix's/15. CM-X-OMRT3-TD-0015 Appendix 4 (III) Notification of processing of personal data word.pdf",
          fileName:
            "15. CM-X-OMRT3-TD-0015 Appendix 4 (III) Notification of processing of personal data word.pdf"
        }),
        file({
          id: "subcontractors_pdf",
          relativePath:
            "b. Conditions of contract with appendix's/11. CM-X-OMRT3-TD-0023 Metroselskabet's Approval of (sub-)subscontractors after the conclusion of the contract.pdf",
          fileName:
            "11. CM-X-OMRT3-TD-0023 Metroselskabet's Approval of (sub-)subscontractors after the conclusion of the contract.pdf"
        })
      ])
    );

    expect(groups.map((group) => group.familyKey)).toEqual([
      "data_processing",
      "subcontractors"
    ]);
    expect(groups[0]?.priority).toBe("high");
  });
});
