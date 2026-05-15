import type { ParserIssueCode, ParserKind } from "../ingestion";

export type ExtractionTask = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8";

export type ExtractionStatus =
  | "proposed"
  | "needs_review"
  | "blocked"
  | "not_applicable";

export type ExtractionRisk = "low" | "medium" | "high" | "critical";

export type ExtractionAiPolicyStatus =
  | "local_only"
  | "external_ai_not_requested"
  | "blocked_by_policy";

export type ExtractionEvidenceKind =
  | "file_metadata"
  | "technical_source_reference"
  | "parser_issue";

export type ExtractionCandidate = {
  id: string;
  tenderId: string;
  packageId: string;
  task: ExtractionTask;
  title: string;
  description: string;
  status: ExtractionStatus;
  risk: ExtractionRisk;
  confidence: number;
  requiresReview: boolean;
  sourceReferenceId: string;
  evidenceKind: ExtractionEvidenceKind;
  parserKind: ParserKind;
  aiPolicyStatus: ExtractionAiPolicyStatus;
  issueCodes: ParserIssueCode[];
  route: string;
};

export type ExtractionRunStatus =
  | "completed_with_review"
  | "completed"
  | "blocked";

export type ExtractionRun = {
  id: string;
  tenderId: string;
  packageId: string;
  status: ExtractionRunStatus;
  startedAt: string;
  completedAt: string;
  candidates: ExtractionCandidate[];
  aiPolicyStatus: ExtractionAiPolicyStatus;
};

export type ReviewGateSeverity = "info" | "warning" | "blocking";

export type ReviewGateItem = {
  id: string;
  candidateId: string;
  task: ExtractionTask;
  title: string;
  severity: ReviewGateSeverity;
  reason: string;
  route: string;
};

export type ExtractionQualityMetrics = {
  candidateCount: number;
  sourceCoverageRatio: number;
  unsupportedClaimCount: number;
  reviewRequiredCount: number;
  blockedCount: number;
  taskCoverage: Record<ExtractionTask, number>;
};

export type PilotReadinessReport = {
  status: "ready_for_internal_pilot" | "blocked";
  userCountTarget: number;
  completedUserCount: number;
  summary: string;
  blockers: string[];
  metrics: ExtractionQualityMetrics;
};
