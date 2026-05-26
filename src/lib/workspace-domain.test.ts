import { describe, expect, it } from "vitest";
import type { LocalTenderDocument, LocalTenderWorkspace } from "./local-workspace/types";
import {
  buildDemoDocumentGroups,
  type DemoInventory,
  type DemoInventoryFile
} from "./demo-inventory";
import {
  buildDemoInventoryDomainCandidates,
  buildLocalDomainCandidates,
  buildLocalRouteStatusCards,
  getDemoInventorySectionGroups
} from "./workspace-domain";

function localDocument(overrides: Partial<LocalTenderDocument>): LocalTenderDocument {
  return {
    contentType: overrides.contentType ?? "text/plain",
    extension: overrides.extension ?? ".txt",
    fileName: overrides.fileName ?? "Documento.txt",
    id: overrides.id ?? "doc_default",
    issues: overrides.issues ?? [],
    parserLabel: overrides.parserLabel ?? "Testo",
    relativePath: overrides.relativePath ?? overrides.fileName ?? "Documento.txt",
    sha256: overrides.sha256 ?? "0".repeat(64),
    sizeBytes: overrides.sizeBytes ?? 1024,
    status: overrides.status ?? "Pronto per il parsing",
    storageKey: overrides.storageKey ?? "tenders/test/documents/default.txt"
  };
}

function localWorkspace(documents: LocalTenderDocument[]): LocalTenderWorkspace {
  return {
    auditEvents: [],
    createdAt: "2026-05-26T10:00:00.000Z",
    documents,
    package: {
      fileCount: documents.length,
      id: "package_test",
      label: "Pacchetto test",
      totalSizeBytes: documents.reduce((total, document) => total + document.sizeBytes, 0)
    },
    reviewItems: [],
    tender: {
      authority: "Ente test",
      city: "Milano",
      id: "local_test_workspace",
      name: "Workspace test",
      notes: "",
      owner: "TRAM",
      privacy: "Uso interno",
      stage: "Gara"
    },
    updatedAt: "2026-05-26T10:00:00.000Z",
    version: 1
  };
}

function file(overrides: Partial<DemoInventoryFile>): DemoInventoryFile {
  return {
    id: overrides.id ?? "demo_test_file",
    tenderId: "tender_cph_m1_m4_om",
    packageId: "copenhagen-m1-m4-om",
    relativePath: overrides.relativePath ?? `a. Tender documents/${overrides.fileName}`,
    fileName: overrides.fileName ?? "Document.pdf",
    extension: overrides.extension ?? ".pdf",
    sizeBytes: overrides.sizeBytes ?? 1024,
    sha256: overrides.sha256 ?? "1".repeat(64),
    contentType: overrides.contentType ?? "application/pdf",
    parserKind: overrides.parserKind ?? "pdf",
    status: overrides.status ?? "needs_ocr_check",
    issueCodes: overrides.issueCodes ?? []
  };
}

function inventory(files: DemoInventoryFile[]): DemoInventory {
  return {
    generatedAt: "2026-05-26T12:00:00.000Z",
    tenderId: "tender_cph_m1_m4_om",
    packageId: "copenhagen-m1-m4-om",
    packageLabel: "CPH M1/M4 O&M",
    rootLabel: "copenhagen-m1-m4-om",
    fileCount: files.length,
    totalSizeBytes: files.reduce((total, item) => total + item.sizeBytes, 0),
    files
  };
}

describe("workspace domain builders", () => {
  it("propone le fonti locali più sensate per scadenze, economia e chiarimenti", () => {
    const documents = [
      localDocument({
        id: "timeline_doc",
        extension: ".mpp",
        fileName: "Implementation_Programme_v2.mpp",
        parserLabel: "Project"
      }),
      localDocument({
        id: "prices_doc",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: ".xlsx",
        fileName: "Schedule_of_prices.xlsx",
        parserLabel: "Workbook"
      }),
      localDocument({
        id: "qa_doc",
        contentType: "application/pdf",
        extension: ".pdf",
        fileName: "Clarification_Register.pdf",
        issues: ["PDF da controllare: può richiedere OCR."],
        parserLabel: "PDF",
        status: "Verifica OCR"
      }),
      localDocument({
        id: "requirements_doc",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: ".docx",
        fileName: "Technical_Specification.docx",
        parserLabel: "Documento Word"
      })
    ];

    const timelineCandidates = buildLocalDomainCandidates({
      documents,
      section: "timeline",
      tenderId: "local_test_workspace"
    });
    const financialCandidates = buildLocalDomainCandidates({
      documents,
      section: "financials",
      tenderId: "local_test_workspace"
    });
    const queryCandidates = buildLocalDomainCandidates({
      documents,
      section: "queries",
      tenderId: "local_test_workspace"
    });

    expect(timelineCandidates[0]?.sourceLabel).toBe("Implementation_Programme_v2.mpp");
    expect(timelineCandidates[0]?.priorityLabel).toBe("Alta priorità");
    expect(financialCandidates[0]?.sourceLabel).toBe("Schedule_of_prices.xlsx");
    expect(queryCandidates[0]?.sourceLabel).toBe("Clarification_Register.pdf");
    expect(queryCandidates[0]?.statusLabel).toBe("Verifica OCR");
  });

  it("riassume lo stato delle sezioni locali a partire dai candidati trovati", () => {
    const documents = [
      localDocument({
        id: "timeline_doc",
        extension: ".mpp",
        fileName: "Procurement_Schedule.mpp",
        parserLabel: "Project"
      }),
      localDocument({
        id: "prices_doc",
        extension: ".xlsx",
        fileName: "Schedule_of_prices.xlsx",
        parserLabel: "Workbook"
      })
    ];

    const routeCards = buildLocalRouteStatusCards(localWorkspace(documents));
    const timelineCard = routeCards.find((item) => item.label === "Scadenze");
    const financialCard = routeCards.find((item) => item.label === "Economia");
    const contradictionsCard = routeCards.find((item) => item.label === "Criticità");

    expect(timelineCard).toMatchObject({
      badge: "Fonte trovata",
      value: "1 fonti per date e milestone"
    });
    expect(financialCard?.badge).toBe("Controllo umano");
    expect(contradictionsCard?.badge).toBe("Da costruire");
  });

  it("usa il percorso standard /tenders per aprire le fonti Copenhagen", () => {
    const groups = buildDemoDocumentGroups(
      inventory([
        file({
          id: "schedule_pdf",
          fileName: "01. Procurement Schedule.pdf"
        }),
        file({
          contentType: "application/vnd.ms-project",
          extension: ".mpp",
          fileName: "Procurement Schedule.mpp",
          id: "schedule_mpp",
          parserKind: "mpp"
        }),
        file({
          fileName: "CM-X-OMRT3-TD-0020 Instructions to Tender.pdf",
          id: "instructions_pdf"
        }),
        file({
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          extension: ".xlsx",
          fileName: "02. Schedule of Prices.xlsx",
          id: "prices_xlsx",
          parserKind: "spreadsheet"
        })
      ])
    );

    const timelineGroups = getDemoInventorySectionGroups({
      groups,
      section: "timeline",
      tenderId: "tender_copenhagen_m1_m4_om"
    });
    const timelineCandidates = buildDemoInventoryDomainCandidates({
      groups,
      section: "timeline",
      tenderId: "tender_copenhagen_m1_m4_om"
    });
    const financialCandidates = buildDemoInventoryDomainCandidates({
      groups,
      section: "financials",
      tenderId: "tender_copenhagen_m1_m4_om"
    });

    expect(timelineGroups.map((group) => group.familyKey)).toContain("procurement_schedule");
    expect(timelineCandidates[0]?.sourceHref).toContain(
      "/tenders/tender_copenhagen_m1_m4_om/documents?source="
    );
    expect(timelineCandidates[0]?.sourceHref).toContain("schedule_mpp");
    expect(timelineCandidates[0]?.title).toContain("Scadenze");
    expect(financialCandidates.some((candidate) => candidate.sourceLabel.includes("Schedule of Prices"))).toBe(
      true
    );
  });
});
