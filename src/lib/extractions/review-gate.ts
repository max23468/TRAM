import type {
  ExtractionCandidate,
  ExtractionQualityMetrics,
  ExtractionTask,
  ReviewGateItem,
  ReviewGateSeverity
} from "./types";

const tasks: ExtractionTask[] = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];

function severityForCandidate(candidate: ExtractionCandidate): ReviewGateSeverity {
  if (candidate.status === "blocked" || candidate.risk === "critical") {
    return "blocking";
  }

  if (candidate.requiresReview || ["high", "medium"].includes(candidate.risk)) {
    return "warning";
  }

  return "info";
}

function reasonForCandidate(candidate: ExtractionCandidate) {
  if (!candidate.sourceReferenceId) {
    return "Fonte mancante: il candidato non può essere consolidato.";
  }

  if (candidate.status === "blocked") {
    return "Candidato bloccato da parser issue o policy.";
  }

  if (candidate.requiresReview) {
    return "Dato da controllare prima di usarlo nel quadro gara.";
  }

  return "Candidato proposto con fonte disponibile.";
}

export function buildReviewGate(candidates: ExtractionCandidate[]): ReviewGateItem[] {
  const gateItems: ReviewGateItem[] = [];

  for (const candidate of candidates) {
    if (candidate.requiresReview || candidate.status === "blocked" || !candidate.sourceReferenceId) {
      gateItems.push({
      id: `gate_${candidate.id}`,
      candidateId: candidate.id,
      task: candidate.task,
      title: candidate.title,
      severity: severityForCandidate(candidate),
      reason: reasonForCandidate(candidate),
      route: candidate.route
      });
    }
  }

  return gateItems
    .sort((left, right) => {
      const weight: Record<ReviewGateSeverity, number> = { blocking: 0, warning: 1, info: 2 };
      return weight[left.severity] - weight[right.severity];
    });
}

export function calculateExtractionQualityMetrics(
  candidates: ExtractionCandidate[]
): ExtractionQualityMetrics {
  const sourcedCandidates = candidates.filter((candidate) => candidate.sourceReferenceId);
  const taskCoverage = Object.fromEntries(
    tasks.map((task) => [
      task,
      candidates.filter((candidate) => candidate.task === task).length
    ])
  ) as Record<ExtractionTask, number>;

  return {
    candidateCount: candidates.length,
    sourceCoverageRatio:
      candidates.length === 0 ? 0 : Number((sourcedCandidates.length / candidates.length).toFixed(3)),
    unsupportedClaimCount: candidates.filter((candidate) => !candidate.sourceReferenceId).length,
    reviewRequiredCount: candidates.filter((candidate) => candidate.requiresReview).length,
    blockedCount: candidates.filter((candidate) => candidate.status === "blocked").length,
    taskCoverage
  };
}
