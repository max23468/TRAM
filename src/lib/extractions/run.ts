import type { ExtractionCandidate, ExtractionRun, ExtractionRunStatus } from "./types";

export function createExtractionRun({
  candidates,
  completedAt,
  packageId,
  startedAt,
  tenderId
}: {
  candidates: ExtractionCandidate[];
  completedAt: string;
  packageId: string;
  startedAt: string;
  tenderId: string;
}): ExtractionRun {
  const status: ExtractionRunStatus = candidates.some((candidate) => candidate.status === "blocked")
    ? "blocked"
    : candidates.some((candidate) => candidate.requiresReview)
      ? "completed_with_review"
      : "completed";

  return {
    id: `run_${tenderId}_${packageId}_${startedAt.replace(/[^0-9]/g, "").slice(0, 14)}`,
    tenderId,
    packageId,
    status,
    startedAt,
    completedAt,
    candidates,
    aiPolicyStatus: candidates.some((candidate) => candidate.aiPolicyStatus === "blocked_by_policy")
      ? "blocked_by_policy"
      : "local_only"
  };
}
