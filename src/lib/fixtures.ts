import { z } from "zod";
import rawFixtures from "../../data/fixtures/tram-v1-mvp-synthetic-fixtures.json";
import { buildPilotReadinessReport } from "./extractions/pilot";
import type { ExtractionQualityMetrics } from "./extractions/types";

export const PRIMARY_ROUTE_NODE_KEYS = [
  "documents",
  "timeline",
  "deliverables",
  "requirements",
  "q_and_a",
  "financials",
  "cost_drivers",
  "criticalities"
] as const;

export const DASHBOARD_STATES = [
  "draft",
  "partially_validated",
  "validated_internal",
  "stale_due_to_new_docs",
  "open_critical_issues"
] as const;

export const DASHBOARD_STATE_INDICATOR_KEY = "dashboard.validation_state.overall";

export const ROUTE_VIEW_CONTRACTS = [
  {
    route: "/tenders",
    primaryShape: "TenderSummary[]",
    secondaryShapes: ["TenderUserCapability", "DashboardValidationState"],
    indicatorKeys: [DASHBOARD_STATE_INDICATOR_KEY, "package.stage", "review.blocking_count"]
  },
  {
    route: "/tenders/:tender_id/overview",
    primaryShape: "TenderOverview",
    secondaryShapes: [
      "IndicatorValue",
      "TenderRouteStrip",
      "ReviewItemSummary",
      "TenderPolicySummary"
    ],
    indicatorKeys: [
      DASHBOARD_STATE_INDICATOR_KEY,
      "package.stage",
      "documents.currentness_status",
      "data_quality.source_coverage_ratio",
      "clarifications.ready_count",
      "clarifications.register_coverage_status",
      "financials.payment_mechanism_status",
      "review.blocking_count",
      "audit.last_gate"
    ]
  },
  {
    route: "/tenders/:tender_id/documents",
    primaryShape: "DocumentVersionRow[]",
    secondaryShapes: ["SourceReferenceSummary", "ReviewItemSummary"],
    indicatorKeys: ["documents.currentness_status", "documents.ingestion_status"]
  },
  {
    route: "/tenders/:tender_id/timeline",
    primaryShape: "TimelineEvent[]",
    secondaryShapes: ["ReviewItemSummary", "TenderDeliverable"],
    indicatorKeys: [
      "timeline.next_deadline_risk",
      "timeline.date_conflict_count",
      "timeline.deadline_status",
      "timeline.schedule_status"
    ]
  },
  {
    route: "/tenders/:tender_id/deliverables",
    primaryShape: "TenderDeliverable[]",
    secondaryShapes: ["TimelineEvent", "ReviewItemSummary"],
    indicatorKeys: ["deliverables.mandatory_count", "deliverables.review_gate_count"]
  },
  {
    route: "/tenders/:tender_id/requirements",
    primaryShape: "RequirementKpiItem[]",
    secondaryShapes: ["FinancialItem", "CostDriver", "ReviewItemSummary"],
    indicatorKeys: ["requirements.kpi_count", "requirements.critical_kpi_count"]
  },
  {
    route: "/tenders/:tender_id/financials",
    primaryShape: "FinancialItem[]",
    secondaryShapes: ["TenderUserCapability", "ReviewItemSummary"],
    indicatorKeys: [
      "financials.item_count",
      "financials.payment_mechanism_status",
      "financials.ai_review_status",
      "financials.owner_approval_status",
      "financials.applicability"
    ]
  },
  {
    route: "/tenders/:tender_id/cost-drivers",
    primaryShape: "CostDriver[]",
    secondaryShapes: ["RequirementKpiItem", "FinancialItem"],
    indicatorKeys: ["cost_drivers.high_risk_count"]
  },
  {
    route: "/tenders/:tender_id/contradictions",
    primaryShape: "ContradictionCandidate[]",
    secondaryShapes: ["SourceReferenceSummary", "ClarificationThread"],
    indicatorKeys: [
      "criticalities.candidate_count",
      "criticalities.pef_issue_count",
      "criticalities.redline_candidate_count"
    ]
  },
  {
    route: "/tenders/:tender_id/queries",
    primaryShape: "ClarificationThread[]",
    secondaryShapes: ["ReviewItemSummary", "SourceReferenceSummary"],
    indicatorKeys: [
      "clarifications.ready_count",
      "clarifications.register_coverage_status",
      "qna.addendum_status"
    ]
  },
  {
    route: "/tenders/:tender_id/review",
    primaryShape: "ReviewItemDetail[]",
    secondaryShapes: ["ValidationAction", "SourceReferenceDetail"],
    indicatorKeys: ["review.blocking_count", "review.open_count"]
  },
  {
    route: "/tenders/:tender_id/audit",
    primaryShape: "AuditEventSummary[]",
    secondaryShapes: ["AiGateDecisionSummary", "AiCallSummary", "TenderPolicySummary"],
    indicatorKeys: ["audit.last_gate", "ai.external_use.status"]
  }
] as const;

export const REVIEW_ACTION_EFFECTS = [
  { action: "confirm", targetStatus: "confirmed", requiresSource: true },
  { action: "correct", targetStatus: "corrected", requiresSource: true },
  { action: "contest", targetStatus: "contested", requiresSource: true },
  { action: "mark_unclear", targetStatus: "unclear", requiresSource: true },
  { action: "mark_superseded", targetStatus: "superseded", requiresSource: true },
  { action: "mark_not_applicable", targetStatus: "not_applicable", requiresSource: false },
  { action: "request_more_evidence", targetStatus: "needs_review", requiresSource: false },
  { action: "regenerate", targetStatus: "proposed", requiresSource: true },
  { action: "create_clarification_thread", targetStatus: "draft_question", requiresSource: true },
  { action: "approve_for_export", targetStatus: "approved_for_export", requiresSource: true },
  { action: "dismiss", targetStatus: "dismissed", requiresSource: false }
] as const;

const aiGateDecisionValues = [
  "allowed_l0_minimized",
  "pending_l1_owner_approval",
  "blocked_l2_effective",
  "quota_exhausted",
  "provider_policy_stale"
] as const;

const manifestSchema = z.object({
  fixture_set_id: z.string(),
  version: z.string(),
  generated_at: z.string(),
  contains_real_tender_data: z.literal(false),
  source_policy: z.literal("synthetic_only")
});

const tenderSchema = z.object({
  id: z.string(),
  name: z.string(),
  stage: z.string(),
  transport_mode: z.string(),
  privacy_level: z.enum(["L0", "L1", "L2"]),
  dashboard_state: z.enum(DASHBOARD_STATES),
  owner_role: z.string(),
  package_label: z.string()
});

const documentSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  family: z.string(),
  version: z.string(),
  currentness: z.string(),
  storage_key: z.string()
});

const sourceReferenceSchema = z.object({
  id: z.string(),
  document_id: z.string(),
  label: z.string(),
  synthetic_excerpt: z.string(),
  page: z.number().int().positive()
});

const indicatorSchema = z.object({
  key: z.string(),
  tender_id: z.string(),
  value: z.string(),
  status: z.string(),
  source_reference_id: z.string(),
  priority: z.enum(["P0", "P1"])
});

const reviewItemSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  task: z.string(),
  title: z.string(),
  risk: z.enum(["low", "medium", "high", "critical"]),
  status: z.string(),
  source_reference_id: z.string()
});

const clarificationRegisterImportSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  source_document_id: z.string(),
  source_filename: z.string(),
  row_count: z.number().int().nonnegative(),
  column_map: z.object({
    number: z.string(),
    subject: z.string(),
    document_reference: z.string(),
    question: z.string(),
    answer: z.string(),
    kind: z.string()
  }),
  rows_with_document_reference_count: z.number().int().nonnegative(),
  rows_without_document_reference_count: z.number().int().nonnegative(),
  clarification_count: z.number().int().nonnegative(),
  correction_count: z.number().int().nonnegative(),
  missing_attachment_count: z.number().int().nonnegative(),
  import_status: z.string()
});

const clarificationThreadSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  status: z.enum(["draft_question", "sent_to_authority", "answered", "incorporated", "blocked"]),
  source_channel: z.enum(["q_and_a_register", "procurement_portal", "manual", "internal_draft"]),
  source_register_row_no: z.string().nullable(),
  document_reference_raw: z.string().nullable(),
  clarification_kind: z.enum(["clarification", "correction", "answer", "update", "unknown"]),
  currentness_effect: z.enum([
    "none",
    "clarifies",
    "corrects",
    "supersedes",
    "adds_requirement",
    "removes_requirement",
    "unknown"
  ]),
  affected_source_ref_ids: z.array(z.string()),
  authority_platform_reference: z.string().nullable(),
  question_summary: z.string(),
  answer_summary: z.string().nullable(),
  blocked_reason: z.string().nullable(),
  requires_dashboard_update: z.boolean(),
  approval_required: z.boolean(),
  approved_by: z.string().nullable(),
  can_export: z.boolean()
});

const timelineEventSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  date_label: z.string(),
  status: z.string(),
  impact: z.enum(["low", "medium", "high", "critical"]),
  source_reference_id: z.string()
});

const deliverableSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  envelope: z.string(),
  status: z.string(),
  source_reference_id: z.string()
});

const requirementSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  domain: z.string(),
  title: z.string(),
  status: z.string(),
  risk: z.enum(["low", "medium", "high", "critical"]),
  source_reference_id: z.string()
});

const financialItemSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  sensitivity: z.enum(["low", "medium", "high"]),
  privacy_level: z.enum(["L0", "L1", "L2"]),
  ai_analysis_status: z.string(),
  status: z.string(),
  source_reference_id: z.string()
});

const costDriverSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  category: z.string(),
  status: z.string(),
  source_reference_id: z.string()
});

const routeNodeSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  node_key: z.enum(PRIMARY_ROUTE_NODE_KEYS),
  label: z.string(),
  route_token: z.enum([
    "route-core",
    "route-document",
    "route-qna",
    "route-review",
    "route-financials",
    "route-risk"
  ]),
  state: z.string(),
  risk: z.enum(["low", "medium", "high", "critical"]).nullable(),
  count_label: z.string().nullable(),
  target_route: z.string(),
  source_reference_ids: z.array(z.string()),
  review_item_ids: z.array(z.string()),
  indicator_keys: z.array(z.string()),
  ai_gate_status: z.string().nullable(),
  is_primary_blocker: z.boolean()
});

const routeEdgeSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  from_node_key: z.enum(PRIMARY_ROUTE_NODE_KEYS),
  to_node_key: z.enum(PRIMARY_ROUTE_NODE_KEYS),
  relation_type: z.string(),
  state: z.string(),
  source_reference_ids: z.array(z.string()),
  review_item_ids: z.array(z.string()),
  label: z.string().nullable()
});

const routeNetworkSchema = z.object({
  tender_id: z.string(),
  overall_state: z.enum(DASHBOARD_STATES),
  primary_blocker_node_key: z.enum(PRIMARY_ROUTE_NODE_KEYS).nullable(),
  nodes: z.array(routeNodeSchema).length(PRIMARY_ROUTE_NODE_KEYS.length),
  edges: z.array(routeEdgeSchema)
});

const contradictionSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  title: z.string(),
  status: z.string(),
  risk: z.enum(["low", "medium", "high", "critical"]),
  source_reference_ids: z.array(z.string()).min(1)
});

const aiGateDecisionSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  task: z.string(),
  privacy_level: z.enum(["L0", "L1", "L2"]),
  decision: z.enum(aiGateDecisionValues),
  reason_code: z.string(),
  provider: z.string(),
  model: z.string().nullable(),
  quota_status: z.enum(["available", "exhausted", "unknown", "not_applicable"]),
  estimated_cost: z.number().nullable(),
  cost_cap: z.string(),
  created_at: z.string()
});

const auditEventSchema = z.object({
  id: z.string(),
  tender_id: z.string(),
  event_type: z.enum(["parsing", "ai_gate", "ai_call", "validation", "policy", "access", "error"]),
  title: z.string(),
  status: z.enum(["not_started", "running", "completed", "failed", "blocked", "suspended"]),
  task: z.string().nullable(),
  related_record_id: z.string().nullable(),
  actor: z.string(),
  action: z.string(),
  created_at: z.string()
});

const fixturesSchema = z.object({
  manifest: manifestSchema,
  tenders: z.array(tenderSchema).min(4),
  documents: z.array(documentSchema),
  source_references: z.array(sourceReferenceSchema),
  indicators: z.array(indicatorSchema),
  review_items: z.array(reviewItemSchema),
  clarification_register_imports: z.array(clarificationRegisterImportSchema),
  clarification_threads: z.array(clarificationThreadSchema),
  timeline_events: z.array(timelineEventSchema),
  deliverables: z.array(deliverableSchema),
  requirements: z.array(requirementSchema),
  financial_items: z.array(financialItemSchema),
  cost_drivers: z.array(costDriverSchema),
  route_networks: z.array(routeNetworkSchema).min(4),
  contradictions: z.array(contradictionSchema),
  ai_gate_decisions: z.array(aiGateDecisionSchema),
  audit_events: z.array(auditEventSchema)
});

export type TramFixtures = z.infer<typeof fixturesSchema>;
export type TramTender = TramFixtures["tenders"][number];
export type TramDocument = TramFixtures["documents"][number];
export type TramSourceReference = TramFixtures["source_references"][number];
export type TramIndicator = TramFixtures["indicators"][number];
export type TramReviewItem = TramFixtures["review_items"][number];
export type TramClarificationRegisterImport =
  TramFixtures["clarification_register_imports"][number];
export type TramClarificationThread = TramFixtures["clarification_threads"][number];
export type TramTimelineEvent = TramFixtures["timeline_events"][number];
export type TramDeliverable = TramFixtures["deliverables"][number];
export type TramRequirement = TramFixtures["requirements"][number];
export type TramFinancialItem = TramFixtures["financial_items"][number];
export type TramCostDriver = TramFixtures["cost_drivers"][number];
export type TramRouteNetwork = TramFixtures["route_networks"][number];
export type TramContradiction = TramFixtures["contradictions"][number];
export type TramAiGateDecision = TramFixtures["ai_gate_decisions"][number];
export type TramAuditEvent = TramFixtures["audit_events"][number];
export type TramRouteViewContract = (typeof ROUTE_VIEW_CONTRACTS)[number];
export type TramReviewActionEffect = (typeof REVIEW_ACTION_EFFECTS)[number];
export type TramIngestionDocumentStatus = {
  document_id: string;
  parser_kind: "pdf" | "spreadsheet" | "text";
  status: "metadata_extracted" | "needs_ocr_check" | "needs_review";
  issue_codes: string[];
  source_reference_count: number;
};
export type TramPilotReadiness = ReturnType<typeof buildPilotReadinessReport>;

let cachedFixtures: TramFixtures | null = null;

export function getTramFixtures(): TramFixtures {
  cachedFixtures ??= fixturesSchema.parse(rawFixtures);
  return cachedFixtures;
}

export function getFixtureSummary() {
  const fixtures = getTramFixtures();

  return {
    fixtureSetId: fixtures.manifest.fixture_set_id,
    fixtureVersion: fixtures.manifest.version,
    tendersCount: fixtures.tenders.length,
    documentsCount: fixtures.documents.length,
    reviewItemsCount: fixtures.review_items.length,
    clarificationImportsCount: fixtures.clarification_register_imports.length,
    clarificationThreadsCount: fixtures.clarification_threads.length,
    timelineEventsCount: fixtures.timeline_events.length,
    deliverablesCount: fixtures.deliverables.length,
    routeNetworksCount: fixtures.route_networks.length,
    aiGateDecisionsCount: fixtures.ai_gate_decisions.length,
    containsRealTenderData: fixtures.manifest.contains_real_tender_data
  };
}

export function getTenderById(tenderId: string): TramTender | undefined {
  return getTramFixtures().tenders.find((tender) => tender.id === tenderId);
}

export function getTenderDocuments(tenderId: string): TramDocument[] {
  return getTramFixtures().documents.filter((document) => document.tender_id === tenderId);
}

export function getTenderIndicators(tenderId: string): TramIndicator[] {
  return getTramFixtures().indicators.filter((indicator) => indicator.tender_id === tenderId);
}

export function getTenderReviewItems(tenderId: string): TramReviewItem[] {
  return getTramFixtures().review_items.filter((item) => item.tender_id === tenderId);
}

export function getTenderClarificationImports(
  tenderId: string
): TramClarificationRegisterImport[] {
  return getTramFixtures().clarification_register_imports.filter(
    (item) => item.tender_id === tenderId
  );
}

export function getTenderClarificationThreads(tenderId: string): TramClarificationThread[] {
  return getTramFixtures().clarification_threads.filter((thread) => thread.tender_id === tenderId);
}

export function getTenderTimelineEvents(tenderId: string): TramTimelineEvent[] {
  return getTramFixtures().timeline_events.filter((event) => event.tender_id === tenderId);
}

export function getTenderDeliverables(tenderId: string): TramDeliverable[] {
  return getTramFixtures().deliverables.filter((deliverable) => deliverable.tender_id === tenderId);
}

export function getTenderRequirements(tenderId: string): TramRequirement[] {
  return getTramFixtures().requirements.filter((requirement) => requirement.tender_id === tenderId);
}

export function getTenderFinancialItems(tenderId: string): TramFinancialItem[] {
  return getTramFixtures().financial_items.filter((item) => item.tender_id === tenderId);
}

export function getTenderCostDrivers(tenderId: string): TramCostDriver[] {
  return getTramFixtures().cost_drivers.filter((driver) => driver.tender_id === tenderId);
}

export function getTenderRouteNetwork(tenderId: string): TramRouteNetwork | undefined {
  return getTramFixtures().route_networks.find((network) => network.tender_id === tenderId);
}

export function getTenderContradictions(tenderId: string): TramContradiction[] {
  return getTramFixtures().contradictions.filter((contradiction) => contradiction.tender_id === tenderId);
}

export function getTenderIngestionDocumentStatuses(tenderId: string): TramIngestionDocumentStatus[] {
  const documents = getTenderDocuments(tenderId);
  const sourceReferences = getTramFixtures().source_references;

  return documents.map((document) => {
    const sourceReferenceCount = sourceReferences.filter(
      (sourceReference) => sourceReference.document_id === document.id
    ).length;
    const parserKind =
      document.family === "pricing_workbook" || document.family === "clarification_register"
        ? "spreadsheet"
        : "pdf";
    const needsReview = document.currentness === "under_review" || sourceReferenceCount === 0;

    return {
      document_id: document.id,
      parser_kind: parserKind,
      status: needsReview ? "needs_review" : "metadata_extracted",
      issue_codes: needsReview
        ? ["parser_requires_review"]
        : parserKind === "pdf"
          ? ["parser_requires_ocr_check"]
          : [],
      source_reference_count: sourceReferenceCount
    };
  });
}

export function getTenderPilotReadiness(tenderId: string): TramPilotReadiness {
  const documents = getTenderDocuments(tenderId);
  const timelineEvents = getTenderTimelineEvents(tenderId);
  const deliverables = getTenderDeliverables(tenderId);
  const requirements = getTenderRequirements(tenderId);
  const financialItems = getTenderFinancialItems(tenderId);
  const costDrivers = getTenderCostDrivers(tenderId);
  const contradictions = getTenderContradictions(tenderId);
  const clarificationThreads = getTenderClarificationThreads(tenderId);
  const reviewItems = getTenderReviewItems(tenderId);
  const taskCoverage = {
    T1: documents.length,
    T2: timelineEvents.length,
    T3: deliverables.length,
    T4: requirements.length,
    T5: financialItems.length,
    T6: costDrivers.length,
    T7: contradictions.length,
    T8: clarificationThreads.length
  };
  const candidateCount = Object.values(taskCoverage).reduce((total, count) => total + count, 0);
  const metrics: ExtractionQualityMetrics = {
    blockedCount: reviewItems.filter((item) => item.status === "blocked").length,
    candidateCount,
    reviewRequiredCount: reviewItems.length,
    sourceCoverageRatio: candidateCount > 0 ? 1 : 0,
    unsupportedClaimCount: 0,
    taskCoverage
  };

  return buildPilotReadinessReport({ metrics });
}

export function getTenderAiGateDecisions(tenderId: string): TramAiGateDecision[] {
  return getTramFixtures().ai_gate_decisions.filter((decision) => decision.tender_id === tenderId);
}

export function getTenderAuditEvents(tenderId: string): TramAuditEvent[] {
  return getTramFixtures().audit_events.filter((event) => event.tender_id === tenderId);
}

export function getSourceReferenceById(sourceReferenceId: string): TramSourceReference | undefined {
  return getTramFixtures().source_references.find(
    (sourceReference) => sourceReference.id === sourceReferenceId
  );
}

export function getTenderOverviewModel(tenderId: string) {
  const fixtures = getTramFixtures();
  const fallbackTender = fixtures.tenders[0];
  const tender = getTenderById(tenderId) ?? fallbackTender;
  const documents = getTenderDocuments(tender.id);
  const documentIds = new Set(documents.map((document) => document.id));
  const sourceReferences = fixtures.source_references.filter((sourceReference) =>
    documentIds.has(sourceReference.document_id)
  );
  const indicators = getTenderIndicators(tender.id);
  const reviewItems = getTenderReviewItems(tender.id);
  const clarificationImports = getTenderClarificationImports(tender.id);
  const clarificationThreads = getTenderClarificationThreads(tender.id);
  const timelineEvents = getTenderTimelineEvents(tender.id);
  const deliverables = getTenderDeliverables(tender.id);
  const requirements = getTenderRequirements(tender.id);
  const financialItems = getTenderFinancialItems(tender.id);
  const costDrivers = getTenderCostDrivers(tender.id);
  const routeNetwork = getTenderRouteNetwork(tender.id);
  const contradictions = getTenderContradictions(tender.id);
  const ingestionDocumentStatuses = getTenderIngestionDocumentStatuses(tender.id);
  const pilotReadiness = getTenderPilotReadiness(tender.id);
  const aiGateDecisions = getTenderAiGateDecisions(tender.id);
  const auditEvents = getTenderAuditEvents(tender.id);

  return {
    tender,
    documents,
    sourceReferences,
    indicators,
    reviewItems,
    clarificationImports,
    clarificationThreads,
    timelineEvents,
    deliverables,
    requirements,
    financialItems,
    costDrivers,
    routeNetwork,
    contradictions,
    ingestionDocumentStatuses,
    pilotReadiness,
    aiGateDecisions,
    auditEvents,
    needsReviewCount: reviewItems.filter((item) =>
      ["open", "needs_owner", "blocked"].includes(item.status)
    ).length,
    dashboardUpdateCount: clarificationThreads.filter((thread) => thread.requires_dashboard_update)
      .length,
    blockedClarificationCount: clarificationThreads.filter((thread) => thread.status === "blocked")
      .length
  };
}

export function assertFixturesDoNotReferenceReservedPaths(fixtures = getTramFixtures()) {
  const serialized = JSON.stringify(fixtures);
  const reservedPathMatch = /data\/packages\/|data\/private\/|\/private\/tmp|ssh-key-tram\.key/.exec(
    serialized
  );

  if (reservedPathMatch) {
    throw new Error(`Fixture non valida: riferimento vietato a ${reservedPathMatch[0]}`);
  }
}
