import { describe, expect, it } from "vitest";
import {
  buildReviewGate,
  calculateExtractionQualityMetrics,
  type ExtractionCandidate
} from ".";

function candidate(overrides: Partial<ExtractionCandidate> = {}): ExtractionCandidate {
  return {
    id: "ext_t1_001",
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    task: "T1",
    title: "Documento candidato",
    description: "Da metadati.",
    status: "proposed",
    risk: "low",
    confidence: 0.72,
    requiresReview: false,
    sourceReferenceId: "src_001",
    evidenceKind: "technical_source_reference",
    parserKind: "pdf",
    aiPolicyStatus: "local_only",
    issueCodes: [],
    route: "documents",
    ...overrides
  };
}

describe("extraction review gate and quality metrics", () => {
  it("ordina gate item per severità e motivo operativo", () => {
    const gate = buildReviewGate([
      candidate({ id: "ok" }),
      candidate({
        id: "review",
        requiresReview: true,
        risk: "high",
        status: "needs_review",
        task: "T5",
        title: "Financial candidate",
        route: "financials"
      }),
      candidate({
        id: "blocked",
        risk: "critical",
        status: "blocked",
        task: "T7",
        title: "Parser issue",
        route: "contradictions"
      })
    ]);

    expect(gate).toEqual([
      expect.objectContaining({
        candidateId: "blocked",
        reason: "Candidato bloccato da parser issue o policy.",
        severity: "blocking"
      }),
      expect.objectContaining({
        candidateId: "review",
        reason: "Dato da controllare prima di usarlo nel quadro gara.",
        severity: "warning"
      })
    ]);
  });

  it("calcola coverage, burden review e claim non supportati", () => {
    const metrics = calculateExtractionQualityMetrics([
      candidate({ task: "T1" }),
      candidate({ requiresReview: true, status: "needs_review", task: "T2" }),
      candidate({ sourceReferenceId: "", task: "T8" })
    ]);

    expect(metrics).toMatchObject({
      blockedCount: 0,
      candidateCount: 3,
      reviewRequiredCount: 1,
      sourceCoverageRatio: 0.667,
      unsupportedClaimCount: 1
    });
    expect(metrics.taskCoverage).toMatchObject({ T1: 1, T2: 1, T8: 1 });
  });

  it("porta in gate anche i candidati con fonte mancante e li marca come info", () => {
    const gate = buildReviewGate([
      candidate({
        id: "missing-source",
        sourceReferenceId: "",
        title: "Fonte assente",
        route: "documents"
      })
    ]);

    expect(gate).toEqual([
      expect.objectContaining({
        candidateId: "missing-source",
        reason: "Fonte mancante: il candidato non può essere consolidato.",
        severity: "info"
      })
    ]);
  });

  it("azzera source coverage e task coverage quando non ci sono candidati", () => {
    const metrics = calculateExtractionQualityMetrics([]);

    expect(metrics).toMatchObject({
      blockedCount: 0,
      candidateCount: 0,
      reviewRequiredCount: 0,
      sourceCoverageRatio: 0,
      unsupportedClaimCount: 0
    });
    expect(metrics.taskCoverage).toEqual({
      T1: 0,
      T2: 0,
      T3: 0,
      T4: 0,
      T5: 0,
      T6: 0,
      T7: 0,
      T8: 0
    });
  });
});
