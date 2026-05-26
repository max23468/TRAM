import { describe, expect, it } from "vitest";
import { readWorkspaceTenderViewModel } from "./workspace-view-model";

describe("workspace view model", () => {
  it("adatta una gara sintetica al renderer workspace unico", async () => {
    const model = await readWorkspaceTenderViewModel({
      description: "Mappa documentale demo",
      section: "documents",
      tenderId: "tender_fx_cop_metro_om",
      title: "Documenti"
    });

    expect(model).not.toBeNull();
    expect(model?.mode).toBe("demo-public");
    expect(model?.shell.sidebarTitle).toBe("Metro Nord O&M 2030");
    expect(model?.shell.headerBadges.some((badge) => badge.label === "Dati dimostrativi")).toBe(true);
    expect(model?.documentGroups[0]?.href).toBe(
      "/tenders/tender_fx_cop_metro_om/documents?source=doc_fx_itt"
    );
    expect(model?.selectedDocumentGroup?.inspector.rawHref).toBeUndefined();
    expect(model?.selectedDocumentGroup?.inspector.sourceText?.text).toContain(
      "Il termine per la presentazione delle offerte"
    );
  });

  it("espone tag e deep link leggibili per la sezione domande della demo sintetica", async () => {
    const model = await readWorkspaceTenderViewModel({
      description: "Domande demo",
      section: "queries",
      tenderId: "tender_fx_cop_metro_om",
      title: "Domande"
    });

    expect(model?.domainView?.candidates.length).toBeGreaterThan(0);
    expect(model?.domainView?.candidates[0]?.sourceHref).toContain(
      "/tenders/tender_fx_cop_metro_om/documents?source="
    );
    expect(model?.domainView?.candidates[0]?.tags).toContain("Correzione");
  });

  it("restituisce null per un tender inesistente", async () => {
    const model = await readWorkspaceTenderViewModel({
      description: "Tender inesistente",
      section: "overview",
      tenderId: "tender_non_esistente",
      title: "Quadro gara"
    });

    expect(model).toBeNull();
  });
});
