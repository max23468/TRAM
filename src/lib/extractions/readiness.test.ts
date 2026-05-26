import { describe, expect, it } from "vitest";
import { buildMvpReadinessReport, type ExtractionQualityMetrics } from ".";

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

describe("MVP readiness report", () => {
  it("distingue prontezza tecnica da test utenti non ancora completato", () => {
    const report = buildMvpReadinessReport({ metrics });

    expect(report).toMatchObject({
      completedUserCount: 0,
      status: "ready_for_user_test",
      userCountTarget: 3
    });
    expect(report.blockers).toContain("Test con utenti interni non ancora completato.");
  });

  it("blocca readiness quando ci sono claim senza fonte", () => {
    const report = buildMvpReadinessReport({
      completedUserCount: 3,
      metrics: {
        ...metrics,
        sourceCoverageRatio: 0.75,
        unsupportedClaimCount: 2
      }
    });

    expect(report.status).toBe("blocked");
    expect(report.blockers).toContain("Alcuni dati proposti non hanno fonte collegata.");
    expect(report.blockers).toContain("Esistono dati non supportati da una fonte.");
  });
});
