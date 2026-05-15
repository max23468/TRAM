import { describe, expect, it } from "vitest";
import { createExtractionRun, type ExtractionCandidate } from ".";

function candidate(overrides: Partial<ExtractionCandidate> = {}): ExtractionCandidate {
  return {
    id: "ext_t1_001",
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    task: "T1",
    title: "Documento classificato",
    description: "Candidato da metadati file.",
    status: "proposed",
    risk: "low",
    confidence: 0.7,
    requiresReview: false,
    sourceReferenceId: "src_001",
    evidenceKind: "file_metadata",
    parserKind: "pdf",
    aiPolicyStatus: "local_only",
    issueCodes: [],
    route: "/documents",
    ...overrides
  };
}

describe("extraction run contract", () => {
  it("marca run completata quando non ci sono review o blocchi", () => {
    const run = createExtractionRun({
      candidates: [candidate()],
      completedAt: "2026-05-15T12:01:00.000Z",
      packageId: "package_fx_001",
      startedAt: "2026-05-15T12:00:00.000Z",
      tenderId: "tender_fx_cop_metro_om"
    });

    expect(run).toMatchObject({
      aiPolicyStatus: "local_only",
      id: "run_tender_fx_cop_metro_om_package_fx_001_20260515120000",
      status: "completed"
    });
  });

  it("porta run a review o blocco quando i candidati lo richiedono", () => {
    const reviewRun = createExtractionRun({
      candidates: [candidate({ requiresReview: true, status: "needs_review" })],
      completedAt: "2026-05-15T12:01:00.000Z",
      packageId: "package_fx_001",
      startedAt: "2026-05-15T12:00:00.000Z",
      tenderId: "tender_fx_cop_metro_om"
    });

    expect(reviewRun.status).toBe("completed_with_review");

    const blockedRun = createExtractionRun({
      candidates: [
        candidate({
          aiPolicyStatus: "blocked_by_policy",
          requiresReview: true,
          status: "blocked"
        })
      ],
      completedAt: "2026-05-15T12:01:00.000Z",
      packageId: "package_fx_001",
      startedAt: "2026-05-15T12:00:00.000Z",
      tenderId: "tender_fx_cop_metro_om"
    });

    expect(blockedRun).toMatchObject({
      aiPolicyStatus: "blocked_by_policy",
      status: "blocked"
    });
  });
});
