import type { ExtractionQualityMetrics, PilotReadinessReport } from "./types";

export function buildPilotReadinessReport({
  completedUserCount = 0,
  metrics,
  userCountTarget = 3
}: {
  completedUserCount?: number;
  metrics: ExtractionQualityMetrics;
  userCountTarget?: number;
}): PilotReadinessReport {
  const blockers: string[] = [];

  if (metrics.candidateCount === 0) {
    blockers.push("Nessun candidato estrazione disponibile.");
  }

  if (metrics.sourceCoverageRatio < 1) {
    blockers.push("Alcuni candidati non hanno fonte collegata.");
  }

  if (metrics.unsupportedClaimCount > 0) {
    blockers.push("Esistono claim non supportati da source reference.");
  }

  if (completedUserCount < userCountTarget) {
    blockers.push("Pilot reale con utenti interni non ancora completato.");
  }

  return {
    status:
      metrics.candidateCount > 0 &&
      metrics.sourceCoverageRatio === 1 &&
      metrics.unsupportedClaimCount === 0
        ? "ready_for_internal_pilot"
        : "blocked",
    userCountTarget,
    completedUserCount,
    summary:
      "Report pilot-ready generato da metriche locali: non sostituisce la validazione con utenti interni.",
    blockers,
    metrics
  };
}
