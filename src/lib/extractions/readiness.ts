import type { ExtractionQualityMetrics, MvpReadinessReport } from "./types";

export function buildMvpReadinessReport({
  completedUserCount = 0,
  metrics,
  userCountTarget = 3
}: {
  completedUserCount?: number;
  metrics: ExtractionQualityMetrics;
  userCountTarget?: number;
}): MvpReadinessReport {
  const blockers: string[] = [];

  if (metrics.candidateCount === 0) {
    blockers.push("Nessun dato proposto disponibile.");
  }

  if (metrics.sourceCoverageRatio < 1) {
    blockers.push("Alcuni dati proposti non hanno fonte collegata.");
  }

  if (metrics.unsupportedClaimCount > 0) {
    blockers.push("Esistono dati non supportati da una fonte.");
  }

  if (completedUserCount < userCountTarget) {
    blockers.push("Test con utenti interni non ancora completato.");
  }

  return {
    status:
      metrics.candidateCount > 0 &&
      metrics.sourceCoverageRatio === 1 &&
      metrics.unsupportedClaimCount === 0
        ? "ready_for_user_test"
        : "blocked",
    userCountTarget,
    completedUserCount,
    summary:
      "Prontezza calcolata da metriche locali: non sostituisce il controllo con utenti interni.",
    blockers,
    metrics
  };
}
