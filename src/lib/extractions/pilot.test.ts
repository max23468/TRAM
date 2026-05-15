import { describe, expect, it } from "vitest";
import { buildPilotReadinessReport, type ExtractionQualityMetrics } from ".";

const metrics: ExtractionQualityMetrics = {
  blockedCount: 0,
  candidateCount: 8,
  reviewRequiredCount: 5,
  sourceCoverageRatio: 1,
  unsupportedClaimCount: 0,
  taskCoverage: {
    T1: 1,
    T2: 1,
    T3: 1,
    T4: 1,
    T5: 1,
    T6: 1,
    T7: 1,
    T8: 1
  }
};

describe("pilot readiness report", () => {
  it("distingue pilot-ready da pilot reale non ancora completato", () => {
    const report = buildPilotReadinessReport({ metrics });

    expect(report).toMatchObject({
      completedUserCount: 0,
      status: "ready_for_internal_pilot",
      userCountTarget: 3
    });
    expect(report.blockers).toContain("Pilot reale con utenti interni non ancora completato.");
  });

  it("blocca readiness quando ci sono claim senza fonte", () => {
    const report = buildPilotReadinessReport({
      completedUserCount: 3,
      metrics: {
        ...metrics,
        sourceCoverageRatio: 0.75,
        unsupportedClaimCount: 2
      }
    });

    expect(report.status).toBe("blocked");
    expect(report.blockers).toContain("Alcuni candidati non hanno fonte collegata.");
    expect(report.blockers).toContain("Esistono claim non supportati da source reference.");
  });
});
