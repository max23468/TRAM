import {
  getSourceReferenceById,
  type TramAiGateDecision,
  type TramDocument,
  type TramIngestionDocumentStatus,
  type TramReviewItem,
  type TramRouteNetwork,
  type TramSourceReference
} from "./fixtures";
import {
  readDemoWorkspaceDataset,
  readDemoWorkspaceTextExtract,
  type DemoFixtureWorkspaceDataset,
  type DemoInventoryDocumentGroup,
  type DemoInventoryWorkspaceDataset
} from "./demo-workspace";
import { copenhagenTenderId } from "./demo-workspace-constants";
import type {
  LocalTenderDocument,
  LocalTenderDocumentStatus,
  LocalTenderReviewRisk,
  LocalTenderReviewStatus,
  LocalTenderWorkspace
} from "./local-workspace/types";
import { readLocalTenderWorkspace } from "./local-workspace/server";
import { buildWorkspaceDocumentApiHref } from "./workspace-documents";
import {
  buildDemoInventoryDomainCandidates,
  buildLocalDomainCandidates,
  buildLocalRouteStatusCards,
  getDemoInventorySectionGroups,
  getWorkspaceDomainLabel,
  getWorkspaceDomainRule,
  type WorkspaceDomainCandidate,
  type WorkspaceDomainSection
} from "./workspace-domain";

type BadgeVariant = "default" | "muted" | "risk" | "success";
type MetricTone = "default" | "attention" | "risk" | "success";
type WorkspaceMode = "local" | "demo-public";
type FixtureTenderOverviewModel = DemoFixtureWorkspaceDataset["model"];

export type WorkspaceIconKey =
  | "alert-triangle"
  | "calendar-days"
  | "check-circle"
  | "clipboard-check"
  | "file-question"
  | "file-spreadsheet"
  | "file-text"
  | "gauge"
  | "layers";

export type WorkspaceBadge = {
  label: string;
  variant: BadgeVariant;
};

export type WorkspaceInfoRow = {
  label: string;
  value: string;
};

export type WorkspaceRouteStatusItem = {
  badge: string;
  badgeVariant: BadgeVariant;
  href: string;
  label: string;
  value: string;
};

export type WorkspaceMetricView = {
  detail?: string;
  href?: string;
  icon: WorkspaceIconKey;
  label: string;
  tone?: MetricTone;
  value: string;
};

export type WorkspaceActionLinkView = {
  detail: string;
  href: string;
  icon: WorkspaceIconKey;
  title: string;
};

export type WorkspacePriorityLinkView = {
  detail: string;
  href?: string;
  icon: WorkspaceIconKey;
  label: string;
  title: string;
};

export type WorkspaceDocumentInspector = {
  badge?: WorkspaceBadge;
  excerpt?: string;
  eyebrow: string;
  rawHref?: string;
  rawLabel?: string;
  rows: WorkspaceInfoRow[];
  secondaryHref?: string;
  secondaryLabel?: string;
  sourceText?: {
    emptyMessage: string;
    label: string;
    text: string | null;
  };
  title: string;
};

export type WorkspaceDocumentGroupView = {
  badges: WorkspaceBadge[];
  currentFileName: string;
  heading: string;
  href: string;
  id: string;
  inspector: WorkspaceDocumentInspector;
  selected: boolean;
  summary: string;
  versionCountLabel: string;
};

export type WorkspaceDomainInsightView = {
  detail: string;
  href: string;
  id: string;
  sourceLabel: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  title: string;
};

export type WorkspaceDomainView = {
  candidates: WorkspaceDomainCandidate[];
  emptyMessage: string;
  insights: WorkspaceDomainInsightView[];
  intro: string;
  label: string;
  statusRows: WorkspaceInfoRow[];
};

export type WorkspaceReviewAction = {
  reviewItemId: string;
  status: LocalTenderReviewStatus;
  tenderId: string;
};

export type WorkspaceReviewItemView = {
  badges: WorkspaceBadge[];
  id: string;
  localAction?: WorkspaceReviewAction;
  reason: string;
  sourceHref?: string;
  sourceLabel?: string;
  title: string;
};

export type WorkspaceAuditItemView = {
  badge: WorkspaceBadge;
  detail: string;
  id: string;
  title: string;
};

export type WorkspaceOverviewView = {
  detailsPanel: {
    kicker: string;
    note?: string;
    rows: WorkspaceInfoRow[];
    title: string;
  };
  metrics: WorkspaceMetricView[];
  primaryActions: WorkspaceActionLinkView[];
  priorityLinks: WorkspacePriorityLinkView[];
  routeItems: WorkspaceRouteStatusItem[];
};

export type WorkspaceShellView = {
  currentSection: string;
  description: string;
  headerBadges: WorkspaceBadge[];
  sectionEyebrow: string;
  sidebarBadges: WorkspaceBadge[];
  sidebarRows: WorkspaceInfoRow[];
  sidebarSubtitle: string;
  sidebarTitle: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  tenderId: string;
  title: string;
};

export type WorkspaceTenderViewModel = {
  auditItems: WorkspaceAuditItemView[];
  documentEmptyMessage: string;
  documentGroups: WorkspaceDocumentGroupView[];
  domainView?: WorkspaceDomainView;
  mode: WorkspaceMode;
  overview: WorkspaceOverviewView;
  reviewEmptyMessage: string;
  reviewItems: WorkspaceReviewItemView[];
  selectedDocumentGroup?: WorkspaceDocumentGroupView;
  shell: WorkspaceShellView;
};

type ReadWorkspaceTenderViewModelInput = {
  description: string;
  section: string;
  sourceId?: string;
  tenderId: string;
  title: string;
};

type LocalWorkspaceViewModelInput = Omit<ReadWorkspaceTenderViewModelInput, "tenderId"> & {
  tenderId: string;
  workspace: LocalTenderWorkspace;
};

type CphWorkspaceViewModelInput = Omit<ReadWorkspaceTenderViewModelInput, "tenderId"> & {
  tenderId: string;
};

type FixtureWorkspaceViewModelInput = Omit<ReadWorkspaceTenderViewModelInput, "tenderId"> & {
  tenderId: string;
};

const sectionEyebrowLabels: Record<string, string> = {
  audit: "registro",
  contradictions: "criticità",
  "cost-drivers": "costi",
  deliverables: "consegne",
  documents: "documenti",
  financials: "economia",
  overview: "quadro gara",
  queries: "domande/risposte",
  requirements: "requisiti",
  review: "controlli",
  timeline: "scadenze"
};

function normalizeFileLabel(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function formatDemoInventoryLabel(value: string) {
  return value
    .replace(/\bCPH\b/g, "Copenhagen")
    .replace(/\bTimeline\b/g, "Scadenze")
    .replace(/\bDeliverables?\b/g, "Consegne")
    .replace(/\bFinancials\b/g, "Economia")
    .replace(/\bCost driver\b/g, "Costi");
}

function localDocumentsPageHref(tenderId: string, documentId: string) {
  return `/tenders/${tenderId}/documents?source=${encodeURIComponent(documentId)}`;
}

function tenderRouteHref(tenderId: string, route: string) {
  return `/tenders/${tenderId}/${route}`;
}

function demoInventoryRawDocumentHref(group: DemoInventoryDocumentGroup) {
  return buildWorkspaceDocumentApiHref(copenhagenTenderId, group.currentVersion.id);
}

function demoInventoryDocumentsPageHref(tenderId: string, sourceId: string) {
  return `/tenders/${tenderId}/documents?source=${encodeURIComponent(sourceId)}`;
}

function statusVariantFromLocalDocument(status: LocalTenderDocumentStatus): BadgeVariant {
  if (status === "Pronto per il parsing") {
    return "success";
  }

  if (status === "Verifica OCR") {
    return "default";
  }

  return "risk";
}

function riskVariant(risk: LocalTenderReviewRisk): BadgeVariant {
  return risk === "Alto" ? "risk" : risk === "Medio" ? "default" : "muted";
}

function reviewStatusVariant(status: LocalTenderReviewStatus): BadgeVariant {
  return status === "Chiuso" ? "success" : status === "In controllo" ? "default" : "risk";
}

function priorityVariant(priority: DemoInventoryDocumentGroup["priority"]): BadgeVariant {
  return priority === "critical" ? "risk" : priority === "high" ? "default" : "muted";
}

function priorityLabel(priority: DemoInventoryDocumentGroup["priority"]) {
  if (priority === "critical") {
    return "Critico";
  }

  if (priority === "high") {
    return "Alta priorità";
  }

  return "Normale";
}

const fixtureDashboardStateLabels: Record<string, string> = {
  draft: "Bozza",
  open_critical_issues: "Criticità aperte",
  partially_validated: "In controllo",
  stale_due_to_new_docs: "Documenti da aggiornare",
  validated_internal: "Controllata"
};

const fixtureCurrentnessLabels: Record<string, string> = {
  current: "Vigente",
  superseded: "Superato",
  under_review: "Da verificare"
};

const fixtureStatusLabels: Record<string, string> = {
  answered: "Risposto",
  blocked: "Bloccato",
  candidate: "Candidato",
  changed_by_qna: "Modificato da risposta",
  clarified_by_qna: "Precisato da risposta",
  completed: "Completato",
  confirmed: "Confermato",
  contested: "Contestato",
  draft_question: "Bozza interna",
  failed: "Fallito",
  human_review_required: "Richiede validazione",
  incorporated: "Incorporato",
  local_review_only: "Solo revisione interna",
  mapped: "Mappato",
  metadata_extracted: "Informazioni base disponibili",
  needs_owner: "Da assegnare",
  needs_ocr_check: "Verifica OCR",
  needs_review: "Da verificare",
  not_started: "Non avviato",
  open: "Aperto",
  proposed: "Proposto",
  ready: "Pronto",
  running: "In corso",
  sent_to_authority: "Registrato su portale",
  structure_only: "Solo struttura",
  suspended: "Sospeso",
  unclear: "Da chiarire",
  watch: "Da monitorare"
};

const fixtureRiskLabels: Record<string, string> = {
  critical: "Critico",
  high: "Alto",
  low: "Basso",
  medium: "Medio"
};

const fixtureTaskLabels: Record<string, string> = {
  T1: "Documenti",
  T2: "Scadenze",
  T3: "Consegne",
  T4: "Requisiti",
  T5: "Economia",
  T6: "Costi",
  T7: "Criticità",
  T8: "Domande"
};

const fixturePrivacyLabels: Record<string, string> = {
  L0: "Documenti pubblici",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

const fixtureStageLabels: Record<string, string> = {
  addendum: "Addendum",
  "draft package": "Bozza documenti",
  negotiation: "Negoziazione",
  prequalification: "Prequalifica",
  "Revised tender": "Gara aggiornata"
};

const fixtureFamilyLabels: Record<string, string> = {
  clarification_register: "Registro domande",
  contract: "Contratto",
  instructions: "Istruzioni",
  performance_regime: "Performance e penali",
  pricing_workbook: "Workbook prezzi",
  technical_specification: "Specifica tecnica"
};

const fixtureRequirementDomainLabels: Record<string, string> = {
  Maintenance: "Manutenzione",
  Operations: "Operazioni",
  "Customer experience": "Esperienza passeggeri"
};

const fixtureClarificationKindLabels: Record<string, string> = {
  answer: "Risposta",
  clarification: "Chiarimento",
  correction: "Correzione",
  unknown: "Da classificare",
  update: "Aggiornamento"
};

const fixtureCurrentnessEffectLabels: Record<string, string> = {
  adds_requirement: "Aggiunge requisito",
  clarifies: "Precisa",
  corrects: "Corregge",
  none: "Nessun impatto",
  removes_requirement: "Rimuove requisito",
  supersedes: "Sostituisce",
  unknown: "Impatto da chiarire"
};

const fixtureRouteNodeKeyBySection: Record<
  "documents" | WorkspaceDomainSection,
  TramRouteNetwork["nodes"][number]["node_key"]
> = {
  contradictions: "criticalities",
  "cost-drivers": "cost_drivers",
  deliverables: "deliverables",
  documents: "documents",
  financials: "financials",
  queries: "q_and_a",
  requirements: "requirements",
  timeline: "timeline"
};

function titleCaseLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatFixtureDashboardState(state: string) {
  return fixtureDashboardStateLabels[state] ?? titleCaseLabel(state);
}

function fixtureDashboardStateVariant(state: string): BadgeVariant {
  if (state === "validated_internal") {
    return "success";
  }

  if (state === "open_critical_issues" || state === "stale_due_to_new_docs") {
    return "risk";
  }

  return "muted";
}

function formatFixtureCurrentness(currentness: string) {
  return fixtureCurrentnessLabels[currentness] ?? titleCaseLabel(currentness);
}

function fixtureCurrentnessVariant(currentness: string): BadgeVariant {
  if (currentness === "current") {
    return "success";
  }

  if (currentness === "under_review") {
    return "risk";
  }

  return "muted";
}

function formatFixtureStatus(status: string) {
  return fixtureStatusLabels[status] ?? titleCaseLabel(status);
}

function fixtureStatusVariant(status: string): BadgeVariant {
  if (["blocked", "failed", "needs_review", "needs_owner", "local_review_only", "suspended"].includes(status)) {
    return "risk";
  }

  if (["confirmed", "completed", "incorporated", "mapped", "metadata_extracted", "ready", "answered"].includes(status)) {
    return "success";
  }

  if (["human_review_required", "needs_ocr_check", "running", "structure_only", "watch", "candidate", "contested", "proposed"].includes(status)) {
    return "default";
  }

  return "muted";
}

function formatFixtureRisk(risk: string) {
  return fixtureRiskLabels[risk] ?? titleCaseLabel(risk);
}

function formatFixtureTask(task: string) {
  return fixtureTaskLabels[task] ?? task;
}

function fixtureRiskVariant(risk?: string | null): BadgeVariant {
  if (risk === "critical" || risk === "high") {
    return "risk";
  }

  if (risk === "medium") {
    return "default";
  }

  return "muted";
}

function formatFixturePrivacy(level: string) {
  return fixturePrivacyLabels[level] ?? level;
}

function formatFixtureStage(stage: string) {
  return fixtureStageLabels[stage] ?? titleCaseLabel(stage);
}

function formatFixtureFamily(family: string) {
  return fixtureFamilyLabels[family] ?? titleCaseLabel(family);
}

function formatFixtureRequirementDomain(domain: string) {
  return fixtureRequirementDomainLabels[domain] ?? titleCaseLabel(domain);
}

function formatFixtureClarificationKind(kind: string) {
  return fixtureClarificationKindLabels[kind] ?? titleCaseLabel(kind);
}

function formatFixtureCurrentnessEffect(effect: string) {
  return fixtureCurrentnessEffectLabels[effect] ?? titleCaseLabel(effect);
}

function formatFixtureAiDecision(decision: TramAiGateDecision["decision"]) {
  const labels: Record<TramAiGateDecision["decision"], string> = {
    allowed_l0_minimized: "Ammesso su testi pubblici minimizzati",
    blocked_l2_effective: "Bloccato per dati riservati",
    pending_l1_owner_approval: "In attesa di approvazione interna",
    provider_policy_stale: "Policy provider da aggiornare",
    quota_exhausted: "Quota gratuita esaurita"
  };

  return labels[decision];
}

function formatFixtureAiDecisionShort(decision: TramAiGateDecision["decision"]) {
  const labels: Record<TramAiGateDecision["decision"], string> = {
    allowed_l0_minimized: "Ammesso",
    blocked_l2_effective: "Bloccato",
    pending_l1_owner_approval: "In attesa",
    provider_policy_stale: "Da aggiornare",
    quota_exhausted: "Quota esaurita"
  };

  return labels[decision];
}

function formatFixtureAiStatus(status: string) {
  const labels: Record<string, string> = {
    allowed_minimized: "Analisi minimizzata ammessa",
    review_after_ai: "Controllo richiesto dopo analisi"
  };

  return labels[status] ?? titleCaseLabel(status);
}

function getOpenReviewCount(workspace: LocalTenderWorkspace) {
  return workspace.reviewItems.filter((item) => item.status !== "Chiuso").length;
}

function getReadyDocumentCount(workspace: LocalTenderWorkspace) {
  return workspace.documents.filter((document) => document.status === "Pronto per il parsing").length;
}

function isDomainSection(section: string): section is WorkspaceDomainSection {
  return [
    "timeline",
    "deliverables",
    "requirements",
    "financials",
    "cost-drivers",
    "contradictions",
    "queries"
  ].includes(section);
}

function findLocalDocument(workspace: LocalTenderWorkspace, sourceId?: string) {
  if (!sourceId) {
    return workspace.documents[0];
  }

  return workspace.documents.find((document) => document.id === sourceId) ?? workspace.documents[0];
}

function findDemoInventoryGroupBySourceId(groups: DemoInventoryDocumentGroup[], sourceId?: string) {
  if (!sourceId) {
    return undefined;
  }

  return groups.find(
    (group) =>
      group.currentVersion.id === sourceId ||
      group.versions.some((version) => version.id === sourceId)
  );
}

function findDemoInventoryGroup(
  groups: DemoInventoryDocumentGroup[],
  familyKey: string,
  documentCode?: string
) {
  return groups.find(
    (group) =>
      group.familyKey === familyKey &&
      (!documentCode || group.documentCode === documentCode)
  );
}

function findFixtureDocument(model: FixtureTenderOverviewModel, sourceId?: string) {
  if (!sourceId) {
    return model.documents[0];
  }

  const document = model.documents.find((item) => item.id === sourceId);

  if (document) {
    return document;
  }

  const sourceReference = model.sourceReferences.find((item) => item.id === sourceId);

  return model.documents.find((item) => item.id === sourceReference?.document_id) ?? model.documents[0];
}

function groupFixtureSourceReferencesByDocument(sourceReferences: TramSourceReference[]) {
  return sourceReferences.reduce<Record<string, TramSourceReference[]>>((groups, sourceReference) => {
    groups[sourceReference.document_id] ??= [];
    groups[sourceReference.document_id].push(sourceReference);
    return groups;
  }, {});
}

function groupFixtureReviewItemsByDocument(
  reviewItems: TramReviewItem[],
  sourceReferences: TramSourceReference[]
) {
  const sourceReferenceById = new Map(sourceReferences.map((sourceReference) => [sourceReference.id, sourceReference]));

  return reviewItems.reduce<Record<string, TramReviewItem[]>>((groups, item) => {
    const sourceReference = sourceReferenceById.get(item.source_reference_id);

    if (!sourceReference) {
      return groups;
    }

    groups[sourceReference.document_id] ??= [];
    groups[sourceReference.document_id].push(item);
    return groups;
  }, {});
}

function buildFixtureSourceText(sourceReferences: TramSourceReference[]) {
  if (sourceReferences.length === 0) {
    return null;
  }

  return sourceReferences
    .slice(0, 4)
    .map(
      (sourceReference) =>
        `${sourceReference.label}, p. ${sourceReference.page}\n${sourceReference.synthetic_excerpt}`
    )
    .join("\n\n");
}

function getFixtureDocumentHref(tenderId: string, documentId: string) {
  return `/tenders/${tenderId}/documents?source=${encodeURIComponent(documentId)}`;
}

function buildFixtureSourceHref(tenderId: string, sourceReferenceId?: string) {
  const sourceReference = sourceReferenceId ? getSourceReferenceById(sourceReferenceId) : undefined;

  if (!sourceReference) {
    return undefined;
  }

  return getFixtureDocumentHref(tenderId, sourceReference.document_id);
}

function clipText(text: string | null) {
  if (!text) {
    return null;
  }

  const normalized = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n");

  return normalized.length > 1800 ? `${normalized.slice(0, 1800)}\n[...]` : normalized;
}

function buildDomainInsights(
  candidates: WorkspaceDomainCandidate[],
  section: WorkspaceDomainSection
): WorkspaceDomainInsightView[] {
  const first = candidates[0];
  if (!first) {
    return [];
  }

  const readyCount = candidates.filter((candidate) => candidate.statusVariant === "success").length;
  const pendingCount = candidates.length - readyCount;
  const primaryTitle: Record<WorkspaceDomainSection, string> = {
    contradictions: "Fonte da confrontare",
    "cost-drivers": "Fonte costi principale",
    deliverables: "Fonte submission principale",
    financials: "Fonte economica principale",
    queries: "Registro chiarimenti principale",
    requirements: "Specifica principale",
    timeline: "Calendario principale"
  };
  const nextPending =
    candidates.find((candidate) => candidate.statusVariant !== "success") ?? first;
  const insights: WorkspaceDomainInsightView[] = [
    {
      detail: first.summary,
      href: first.sourceHref,
      id: `${section}:primary`,
      sourceLabel: first.sourceLabel,
      statusLabel: first.statusLabel,
      statusVariant: first.statusVariant,
      title: primaryTitle[section]
    },
    {
      detail:
        candidates.length === 1
          ? "Una sola fonte candidata selezionata per iniziare il lavoro in questa sezione."
          : `${candidates.length} fonti candidate collegate alla sezione, ordinate per priorità e stato.`,
      href: first.sourceHref,
      id: `${section}:coverage`,
      sourceLabel: first.sourceLabel,
      statusLabel: `${readyCount} pronte`,
      statusVariant: readyCount === candidates.length ? "success" : "default",
      title: "Copertura fonti"
    }
  ];

  if (pendingCount > 0) {
    insights.push({
      detail:
        pendingCount === 1
          ? "Una fonte richiede ancora controllo prima dell’uso operativo."
          : `${pendingCount} fonti richiedono ancora controllo prima dell’uso operativo.`,
      href: nextPending.sourceHref,
      id: `${section}:review`,
      sourceLabel: nextPending.sourceLabel,
      statusLabel: "Controllo richiesto",
      statusVariant: "risk",
      title: "Verifiche aperte"
    });
  }

  return insights;
}

function buildDomainView({
  automationLabel,
  candidates,
  section
}: {
  automationLabel: string;
  candidates: WorkspaceDomainCandidate[];
  section: WorkspaceDomainSection;
}): WorkspaceDomainView {
  const rule = getWorkspaceDomainRule(section);
  const readyCount = candidates.filter((candidate) => candidate.statusVariant === "success").length;

  return {
    candidates,
    emptyMessage: rule.noCandidateMessage,
    insights: buildDomainInsights(candidates, section),
    intro:
      "TRAM propone fonti candidate, stato di lavoro e passaggio obbligato dai controlli prima di consolidare un dato.",
    label: getWorkspaceDomainLabel(section),
    statusRows: [
      { label: "Fonti candidate", value: `${candidates.length} item` },
      { label: "Pronte all’analisi", value: String(readyCount) },
      { label: "Da controllare", value: String(Math.max(candidates.length - readyCount, 0)) },
      { label: "Automazione", value: automationLabel },
      { label: "Scopo", value: rule.purpose },
      { label: "Prossimo passo", value: rule.sourceHint }
    ]
  };
}

function buildLocalDocumentGroup(
  document: LocalTenderDocument,
  selected: boolean,
  tenderId: string
): WorkspaceDocumentGroupView {
  const rawHref = buildWorkspaceDocumentApiHref(tenderId, document.id);
  const href = localDocumentsPageHref(tenderId, document.id);
  const excerpt =
    document.issues.length > 0
      ? document.issues.join(" ")
      : "File disponibile nel workspace locale, pronto per essere usato nelle sezioni operative.";

  return {
    badges: [
      { label: document.status, variant: statusVariantFromLocalDocument(document.status) },
      { label: document.parserLabel, variant: "muted" },
      { label: document.extension.replace(".", "").toUpperCase(), variant: "muted" }
    ],
    currentFileName: document.fileName,
    heading: normalizeFileLabel(document.fileName),
    href,
    id: document.id,
    inspector: {
      badge: { label: document.status, variant: statusVariantFromLocalDocument(document.status) },
      excerpt,
      eyebrow: "Fonte selezionata",
      rawHref,
      rawLabel: "Apri file",
      rows: [
        { label: "Formato", value: document.parserLabel },
        { label: "Estensione", value: document.extension },
        { label: "Dimensione", value: formatBytes(document.sizeBytes) },
        { label: "Storage", value: "Locale fuori repo" },
        { label: "Hash", value: document.sha256.slice(0, 16) }
      ],
      secondaryHref: tenderRouteHref(tenderId, "review"),
      secondaryLabel: "Apri controlli",
      title: normalizeFileLabel(document.fileName)
    },
    selected,
    summary: `${document.parserLabel} · ${formatBytes(document.sizeBytes)} · storage locale`,
    versionCountLabel: "1 versione"
  };
}

function buildDemoInventoryDocumentGroup(
  group: DemoInventoryDocumentGroup,
  selected: boolean,
  selectedText: string | null,
  tenderId: string
): WorkspaceDocumentGroupView {
  return {
    badges: [
      { label: priorityLabel(group.priority), variant: priorityVariant(group.priority) },
      { label: group.areaLabel, variant: "muted" },
      ...(group.documentCode ? [{ label: group.documentCode, variant: "muted" as const }] : [])
    ],
    currentFileName: group.currentVersion.fileName,
    heading: formatDemoInventoryLabel(group.familyLabel),
    href: demoInventoryDocumentsPageHref(tenderId, group.currentVersion.id),
    id: group.id,
    inspector: {
      badge: { label: priorityLabel(group.priority), variant: priorityVariant(group.priority) },
      excerpt: group.reviewFocus,
      eyebrow: "Fonte selezionata",
      rawHref: demoInventoryRawDocumentHref(group),
      rawLabel: "Apri file",
      rows: [
        { label: "Area", value: group.areaLabel },
        { label: "Versione", value: group.currentVersion.versionLabel },
        { label: "Formato", value: group.currentVersion.formatLabel },
        { label: "Dimensione", value: formatBytes(group.currentVersion.sizeBytes) }
      ],
      secondaryHref: tenderRouteHref(tenderId, "review"),
      secondaryLabel: "Apri controlli",
      sourceText: {
        emptyMessage: "Nessun estratto testuale collegato a questa famiglia.",
        label: "Evidenza testuale PDF",
        text: selectedText
      },
      title: formatDemoInventoryLabel(group.familyLabel)
    },
    selected,
    summary: formatDemoInventoryLabel(group.title),
    versionCountLabel: `${group.versions.length} versioni`
  };
}

function buildFixtureDocumentGroup({
  document,
  ingestionStatus,
  reviewItems,
  selected,
  sourceReferences,
  tenderId
}: {
  document: TramDocument;
  ingestionStatus?: TramIngestionDocumentStatus;
  reviewItems: TramReviewItem[];
  selected: boolean;
  sourceReferences: TramSourceReference[];
  tenderId: string;
}): WorkspaceDocumentGroupView {
  const sourceText = buildFixtureSourceText(sourceReferences);

  return {
    badges: [
      {
        label: formatFixtureCurrentness(document.currentness),
        variant: fixtureCurrentnessVariant(document.currentness)
      },
      { label: formatFixtureFamily(document.family), variant: "muted" },
      ...(reviewItems.length > 0
        ? [{ label: `${reviewItems.length} controlli`, variant: "risk" as const }]
        : [])
    ],
    currentFileName: `${document.version} · ${formatFixtureFamily(document.family)}`,
    heading: document.title,
    href: getFixtureDocumentHref(tenderId, document.id),
    id: document.id,
    inspector: {
      badge: {
        label: formatFixtureCurrentness(document.currentness),
        variant: fixtureCurrentnessVariant(document.currentness)
      },
      excerpt:
        sourceReferences[0]?.synthetic_excerpt ??
        "Nessun estratto sintetico disponibile per questo documento dimostrativo.",
      eyebrow: "Fonte selezionata",
      rows: [
        { label: "Famiglia", value: formatFixtureFamily(document.family) },
        { label: "Versione", value: document.version },
        { label: "Riferimenti fonte", value: String(sourceReferences.length) },
        {
          label: "Stato lettura",
          value: ingestionStatus ? formatFixtureStatus(ingestionStatus.status) : "Non disponibile"
        }
      ],
      secondaryHref: tenderRouteHref(tenderId, "review"),
      secondaryLabel: "Apri controlli",
      sourceText: {
        emptyMessage: "Nessun estratto sintetico collegato a questo documento.",
        label: "Estratti sintetici disponibili",
        text: sourceText
      },
      title: document.title
    },
    selected,
    summary: `${sourceReferences.length} riferimenti fonte · ${reviewItems.length} controlli collegati`,
    versionCountLabel: document.version
  };
}

function buildFixtureRouteStatusCards(model: FixtureTenderOverviewModel): WorkspaceRouteStatusItem[] {
  const sections: Array<"documents" | WorkspaceDomainSection> = [
    "documents",
    "timeline",
    "deliverables",
    "requirements",
    "financials",
    "cost-drivers",
    "contradictions",
    "queries"
  ];

  return sections.map((section) => {
    const nodeKey = fixtureRouteNodeKeyBySection[section];
    const node = model.routeNetwork?.nodes.find((item) => item.node_key === nodeKey);
    const label =
      section === "documents" ? "Documenti" : getWorkspaceDomainLabel(section as WorkspaceDomainSection);

    if (!node) {
      return {
        badge: "Da costruire",
        badgeVariant: "muted",
        href: tenderRouteHref(model.tender.id, section === "documents" ? "documents" : section),
        label,
        value: "Nessun dato strutturato"
      };
    }

    return {
      badge: node.is_primary_blocker ? "Blocco principale" : formatFixtureStatus(node.state),
      badgeVariant: node.is_primary_blocker
        ? "risk"
        : node.risk
          ? fixtureRiskVariant(node.risk)
          : fixtureStatusVariant(node.state),
      href: node.target_route,
      label,
      value: node.count_label ?? "In controllo"
    };
  });
}

function buildFixtureDomainCandidateFromSource({
  id,
  priorityLabel,
  priorityVariant,
  sourceHref,
  sourceLabel,
  statusLabel,
  statusVariant,
  summary,
  tags,
  title
}: {
  id: string;
  priorityLabel: string;
  priorityVariant: BadgeVariant;
  sourceHref?: string;
  sourceLabel?: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  summary: string;
  tags: string[];
  title: string;
}): WorkspaceDomainCandidate {
  return {
    id,
    priorityLabel,
    priorityVariant,
    sourceHref: sourceHref ?? "#document-map",
    sourceLabel: sourceLabel ?? "Fonte demo non trovata",
    statusLabel,
    statusVariant,
    summary,
    tags,
    title
  };
}

function buildFixtureDomainCandidates(
  model: FixtureTenderOverviewModel,
  section: WorkspaceDomainSection
): WorkspaceDomainCandidate[] {
  if (section === "timeline") {
    return model.timelineEvents.map((event) => {
      const sourceReference = getSourceReferenceById(event.source_reference_id);

      return buildFixtureDomainCandidateFromSource({
        id: event.id,
        priorityLabel: formatFixtureRisk(event.impact),
        priorityVariant: fixtureRiskVariant(event.impact),
        sourceHref: buildFixtureSourceHref(model.tender.id, event.source_reference_id),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(event.status),
        statusVariant: fixtureStatusVariant(event.status),
        summary: `${event.date_label} · ${formatFixtureStatus(event.status)}`,
        tags: [event.date_label],
        title: event.title
      });
    });
  }

  if (section === "deliverables") {
    return model.deliverables.map((deliverable) => {
      const sourceReference = getSourceReferenceById(deliverable.source_reference_id);

      return buildFixtureDomainCandidateFromSource({
        id: deliverable.id,
        priorityLabel: deliverable.status === "needs_review" ? "Alta priorità" : "Priorità normale",
        priorityVariant: deliverable.status === "needs_review" ? "risk" : "muted",
        sourceHref: buildFixtureSourceHref(model.tender.id, deliverable.source_reference_id),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(deliverable.status),
        statusVariant: fixtureStatusVariant(deliverable.status),
        summary: `${deliverable.envelope} · ${formatFixtureStatus(deliverable.status)}`,
        tags: [deliverable.envelope],
        title: deliverable.title
      });
    });
  }

  if (section === "requirements") {
    return model.requirements.map((requirement) => {
      const sourceReference = getSourceReferenceById(requirement.source_reference_id);

      return buildFixtureDomainCandidateFromSource({
        id: requirement.id,
        priorityLabel: formatFixtureRisk(requirement.risk),
        priorityVariant: fixtureRiskVariant(requirement.risk),
        sourceHref: buildFixtureSourceHref(model.tender.id, requirement.source_reference_id),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(requirement.status),
        statusVariant: fixtureStatusVariant(requirement.status),
        summary: `${formatFixtureRequirementDomain(requirement.domain)} · ${formatFixtureStatus(requirement.status)}`,
        tags: [formatFixtureRequirementDomain(requirement.domain)],
        title: requirement.title
      });
    });
  }

  if (section === "financials") {
    return model.financialItems.map((item) => {
      const sourceReference = getSourceReferenceById(item.source_reference_id);

      return buildFixtureDomainCandidateFromSource({
        id: item.id,
        priorityLabel: formatFixtureRisk(item.sensitivity),
        priorityVariant: fixtureRiskVariant(item.sensitivity),
        sourceHref: buildFixtureSourceHref(model.tender.id, item.source_reference_id),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(item.status),
        statusVariant: fixtureStatusVariant(item.status),
        summary: `${formatFixtureAiStatus(item.ai_analysis_status)} · ${formatFixturePrivacy(item.privacy_level)}`,
        tags: [formatFixturePrivacy(item.privacy_level)],
        title: item.title
      });
    });
  }

  if (section === "cost-drivers") {
    return model.costDrivers.map((item) => {
      const sourceReference = getSourceReferenceById(item.source_reference_id);

      return buildFixtureDomainCandidateFromSource({
        id: item.id,
        priorityLabel: item.status === "needs_review" ? "Alta priorità" : "Priorità media",
        priorityVariant: item.status === "needs_review" ? "risk" : "default",
        sourceHref: buildFixtureSourceHref(model.tender.id, item.source_reference_id),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(item.status),
        statusVariant: fixtureStatusVariant(item.status),
        summary: `${titleCaseLabel(item.category)} · ${formatFixtureStatus(item.status)}`,
        tags: [titleCaseLabel(item.category)],
        title: item.title
      });
    });
  }

  if (section === "contradictions") {
    return model.contradictions.map((item) => {
      const sourceReference = getSourceReferenceById(item.source_reference_ids[0]);

      return buildFixtureDomainCandidateFromSource({
        id: item.id,
        priorityLabel: formatFixtureRisk(item.risk),
        priorityVariant: fixtureRiskVariant(item.risk),
        sourceHref: buildFixtureSourceHref(model.tender.id, item.source_reference_ids[0]),
        sourceLabel: sourceReference?.label,
        statusLabel: formatFixtureStatus(item.status),
        statusVariant: fixtureStatusVariant(item.status),
        summary: `${item.source_reference_ids.length} fonti da confrontare prima di chiudere il punto.`,
        tags: [`${item.source_reference_ids.length} fonti`],
        title: item.title
      });
    });
  }

  const registerSourceDocumentId = model.clarificationImports[0]?.source_document_id;

  return model.clarificationThreads.map((thread) => {
    const primarySourceReference = thread.affected_source_ref_ids
      .map((sourceReferenceId) => getSourceReferenceById(sourceReferenceId))
      .find((sourceReference): sourceReference is TramSourceReference => Boolean(sourceReference));
    const sourceHref = primarySourceReference
      ? buildFixtureSourceHref(model.tender.id, primarySourceReference.id)
      : registerSourceDocumentId
        ? getFixtureDocumentHref(model.tender.id, registerSourceDocumentId)
        : tenderRouteHref(model.tender.id, "documents");

    return buildFixtureDomainCandidateFromSource({
      id: thread.id,
      priorityLabel:
        thread.status === "blocked" || thread.requires_dashboard_update ? "Alta priorità" : "Priorità media",
      priorityVariant:
        thread.status === "blocked" || thread.requires_dashboard_update ? "risk" : "default",
      sourceHref,
      sourceLabel: primarySourceReference?.label ?? model.clarificationImports[0]?.source_filename,
      statusLabel: formatFixtureStatus(thread.status),
      statusVariant: thread.status === "blocked" ? "risk" : fixtureStatusVariant(thread.status),
      summary: thread.answer_summary ?? thread.question_summary,
      tags: [
        formatFixtureClarificationKind(thread.clarification_kind),
        formatFixtureCurrentnessEffect(thread.currentness_effect)
      ],
      title: thread.title
    });
  });
}

function buildFixtureOverview(model: FixtureTenderOverviewModel): WorkspaceOverviewView {
  const currentDocuments = model.documents.filter((document) => document.currentness === "current").length;
  const timelineSource = buildFixtureDomainCandidates(model, "timeline")[0];
  const deliverableSource = buildFixtureDomainCandidates(model, "deliverables")[0];
  const requirementSource = buildFixtureDomainCandidates(model, "requirements")[0];
  const financialSource = buildFixtureDomainCandidates(model, "financials")[0];
  const lastAuditEvent = model.auditEvents.toSorted((left, right) =>
    right.created_at.localeCompare(left.created_at)
  )[0];

  return {
    detailsPanel: {
      kicker: "Set dimostrativo",
      rows: [
        { label: "Pacchetto", value: model.tender.package_label },
        { label: "Fase", value: formatFixtureStage(model.tender.stage) },
        { label: "Owner", value: model.tender.owner_role },
        {
          label: "Aggiornato",
          value: lastAuditEvent ? new Date(lastAuditEvent.created_at).toLocaleString("it-IT") : "Non disponibile"
        }
      ],
      title: "Contesto demo"
    },
    metrics: [
      {
        detail: "Derivato da fonti, controlli e criticità aperte",
        href: tenderRouteHref(model.tender.id, "overview"),
        icon: "gauge",
        label: "Stato gara",
        tone: fixtureDashboardStateVariant(model.tender.dashboard_state) === "risk" ? "risk" : "default",
        value: formatFixtureDashboardState(model.tender.dashboard_state)
      },
      {
        detail: `${currentDocuments}/${model.documents.length} documenti vigenti nel set`,
        href: tenderRouteHref(model.tender.id, "documents"),
        icon: "layers",
        label: "Documenti",
        value: String(model.documents.length)
      },
      {
        detail: `${model.reviewItems.length} controlli totali nel set demo`,
        href: tenderRouteHref(model.tender.id, "review"),
        icon: "clipboard-check",
        label: "Controlli aperti",
        tone: model.needsReviewCount > 0 ? "risk" : "success",
        value: String(model.needsReviewCount)
      },
      {
        detail:
          model.dashboardUpdateCount > 0
            ? `${model.dashboardUpdateCount} aggiornamenti impattano il quadro gara`
            : "Nessun aggiornamento pendente",
        href: tenderRouteHref(model.tender.id, "queries"),
        icon: "file-question",
        label: "Domande aperte",
        tone: model.dashboardUpdateCount > 0 ? "risk" : "default",
        value: String(model.clarificationThreads.length)
      }
    ],
    primaryActions: [
      {
        detail: "Apri le fonti sintetiche, verifica stato dei documenti e usa gli estratti disponibili.",
        href: tenderRouteHref(model.tender.id, "documents"),
        icon: "file-text",
        title: "Controlla documenti"
      },
      {
        detail: "Chiudi i controlli aperti prima di usare i dati nel quadro gara.",
        href: tenderRouteHref(model.tender.id, "review"),
        icon: "clipboard-check",
        title: "Apri controlli"
      },
      {
        detail: "Passa alle sezioni operative per lavorare su date, consegne, requisiti ed economia.",
        href: tenderRouteHref(model.tender.id, "timeline"),
        icon: "calendar-days",
        title: "Vai alle sezioni operative"
      }
    ],
    priorityLinks: [
      {
        detail: timelineSource?.summary ?? "Nessuna scadenza strutturata disponibile.",
        href: timelineSource?.sourceHref,
        icon: "calendar-days",
        label: "Scadenze",
        title: timelineSource?.title ?? "Scadenze principali"
      },
      {
        detail: deliverableSource?.summary ?? "Nessuna consegna strutturata disponibile.",
        href: deliverableSource?.sourceHref,
        icon: "file-text",
        label: "Consegne",
        title: deliverableSource?.title ?? "Consegne principali"
      },
      {
        detail: requirementSource?.summary ?? "Nessun requisito strutturato disponibile.",
        href: requirementSource?.sourceHref,
        icon: "check-circle",
        label: "Requisiti",
        title: requirementSource?.title ?? "Requisiti principali"
      },
      {
        detail: financialSource?.summary ?? "Nessuna voce economica strutturata disponibile.",
        href: financialSource?.sourceHref,
        icon: "file-spreadsheet",
        label: "Economia",
        title: financialSource?.title ?? "Economia principale"
      }
    ],
    routeItems: buildFixtureRouteStatusCards(model)
  };
}

function buildFixtureReviewItems(model: FixtureTenderOverviewModel): WorkspaceReviewItemView[] {
  return model.reviewItems.map((item) => {
    const sourceReference = getSourceReferenceById(item.source_reference_id);

    return {
      badges: [
        { label: formatFixtureRisk(item.risk), variant: fixtureRiskVariant(item.risk) },
        { label: formatFixtureStatus(item.status), variant: fixtureStatusVariant(item.status) }
      ],
      id: item.id,
      reason: `${formatFixtureTask(item.task)} · verificare il riferimento prima di usare il dato nel quadro gara.`,
      sourceHref: buildFixtureSourceHref(model.tender.id, item.source_reference_id),
      sourceLabel: sourceReference?.label,
      title: item.title
    };
  });
}

function buildFixtureAuditItems(model: FixtureTenderOverviewModel): WorkspaceAuditItemView[] {
  const auditEvents: WorkspaceAuditItemView[] = model.auditEvents
    .toSorted((left, right) => right.created_at.localeCompare(left.created_at))
    .map((event) => ({
      badge: {
        label: formatFixtureStatus(event.status),
        variant: fixtureStatusVariant(event.status)
      },
      detail: `${event.actor} · ${event.action} · ${new Date(event.created_at).toLocaleString("it-IT")}`,
      id: event.id,
      title: event.title
    }));

  const aiGateEvents: WorkspaceAuditItemView[] = model.aiGateDecisions
    .toSorted((left, right) => right.created_at.localeCompare(left.created_at))
    .map((decision) => ({
      badge: {
        label: formatFixtureAiDecisionShort(decision.decision),
        variant:
          decision.decision === "allowed_l0_minimized"
            ? "success"
            : decision.decision === "pending_l1_owner_approval"
              ? "default"
              : "risk"
      },
      detail: `${formatFixtureTask(decision.task)} · ${formatFixturePrivacy(decision.privacy_level)} · ${decision.provider} · ${new Date(
        decision.created_at
      ).toLocaleString("it-IT")}`,
      id: decision.id,
      title: formatFixtureAiDecision(decision.decision)
    }));

  return [...auditEvents, ...aiGateEvents];
}

function buildFixtureWorkspaceViewModel({
  description,
  section,
  sourceId,
  tenderId,
  title,
  dataset
}: FixtureWorkspaceViewModelInput & {
  dataset: DemoFixtureWorkspaceDataset;
}): WorkspaceTenderViewModel {
  const { model } = dataset;
  const sourceReferencesByDocument = groupFixtureSourceReferencesByDocument(model.sourceReferences);
  const reviewItemsByDocument = groupFixtureReviewItemsByDocument(
    model.reviewItems,
    model.sourceReferences
  );
  const ingestionByDocument = new Map(
    model.ingestionDocumentStatuses.map((status) => [status.document_id, status])
  );
  const selectedDocument = findFixtureDocument(model, sourceId);
  const documentGroups = model.documents.map((document) =>
    buildFixtureDocumentGroup({
      document,
      ingestionStatus: ingestionByDocument.get(document.id),
      reviewItems: reviewItemsByDocument[document.id] ?? [],
      selected: document.id === selectedDocument?.id,
      sourceReferences: sourceReferencesByDocument[document.id] ?? [],
      tenderId
    })
  );
  const currentDomainView = isDomainSection(section)
    ? buildDomainView({
        automationLabel: "Dataset dimostrativo strutturato e collegato a fonti sintetiche",
        candidates: buildFixtureDomainCandidates(model, section),
        section
      })
    : undefined;

  return {
    auditItems: buildFixtureAuditItems(model),
    documentEmptyMessage: "Nessun documento dimostrativo disponibile per questa gara.",
    documentGroups,
    domainView: currentDomainView,
    mode: "demo-public",
    overview: buildFixtureOverview(model),
    reviewEmptyMessage: "Nessun controllo aperto nella gara dimostrativa.",
    reviewItems: buildFixtureReviewItems(model),
    selectedDocumentGroup: documentGroups.find((group) => group.id === selectedDocument?.id),
    shell: {
      currentSection: section,
      description,
      headerBadges: [
        {
          label: formatFixtureDashboardState(model.tender.dashboard_state),
          variant: fixtureDashboardStateVariant(model.tender.dashboard_state)
        },
        { label: "Dati dimostrativi", variant: "success" }
      ],
      sectionEyebrow: sectionEyebrowLabels[section] ?? section,
      sidebarBadges: [
        { label: formatFixtureStage(model.tender.stage), variant: "default" },
        { label: formatFixturePrivacy(model.tender.privacy_level), variant: "muted" }
      ],
      sidebarRows: [
        { label: "Documenti", value: String(model.documents.length) },
        { label: "Da controllare", value: String(model.needsReviewCount) },
        {
          label: "Fonte aperta",
          value: selectedDocument?.title ?? "Nessuna"
        }
      ],
      sidebarSubtitle: model.tender.package_label,
      sidebarTitle: model.tender.name,
      statusLabel: "Dati dimostrativi",
      statusVariant: "default",
      tenderId,
      title
    }
  };
}

function buildLocalOverview(workspace: LocalTenderWorkspace): WorkspaceOverviewView {
  const openReviewCount = getOpenReviewCount(workspace);
  const readyCount = getReadyDocumentCount(workspace);
  const ocrCount = workspace.documents.filter((document) => document.status === "Verifica OCR").length;

  return {
    detailsPanel: {
      kicker: "Fonte locale",
      note: workspace.tender.notes || undefined,
      rows: [
        { label: "Riferimento", value: workspace.package.label },
        { label: "Ente", value: workspace.tender.authority || "Non indicato" },
        { label: "Owner", value: workspace.tender.owner || "Non indicato" },
        { label: "Aggiornato", value: new Date(workspace.updatedAt).toLocaleString("it-IT") }
      ],
      title: "Pacchetto"
    },
    metrics: [
      {
        detail: `${formatBytes(workspace.package.totalSizeBytes)} salvati fuori dal repo`,
        href: tenderRouteHref(workspace.tender.id, "documents"),
        icon: "layers",
        label: "Documenti",
        value: String(workspace.documents.length)
      },
      {
        detail: "Generati dall’inventario locale",
        href: tenderRouteHref(workspace.tender.id, "review"),
        icon: "clipboard-check",
        label: "Controlli aperti",
        tone: openReviewCount > 0 ? "risk" : "success",
        value: String(openReviewCount)
      },
      {
        detail: "File leggibili dal parser locale",
        href: tenderRouteHref(workspace.tender.id, "documents"),
        icon: "check-circle",
        label: "Pronti",
        tone: "success",
        value: String(readyCount)
      },
      {
        detail: "PDF o file da verificare",
        href: tenderRouteHref(workspace.tender.id, "documents"),
        icon: "alert-triangle",
        label: "OCR/limiti",
        tone: ocrCount > 0 ? "risk" : "default",
        value: String(ocrCount)
      }
    ],
    primaryActions: [
      {
        detail: "Controlla OCR, formati non supportati, file vuoti e hash.",
        href: tenderRouteHref(workspace.tender.id, "documents"),
        icon: "file-text",
        title: "Verifica documenti"
      },
      {
        detail: "Chiudi o metti in controllo gli item aperti prima di usare i dati.",
        href: tenderRouteHref(workspace.tender.id, "review"),
        icon: "clipboard-check",
        title: "Gestisci controlli"
      },
      {
        detail: "Apri scadenze, consegne, requisiti ed economia per iniziare il lavoro operativo.",
        href: tenderRouteHref(workspace.tender.id, "timeline"),
        icon: "calendar-days",
        title: "Passa alle sezioni operative"
      }
    ],
    priorityLinks: [],
    routeItems: buildLocalRouteStatusCards(workspace)
  };
}

function buildDemoInventoryOverview({
  generatedAt,
  groups,
  priorityGroups,
  tenderId,
  textPdfCount,
  totalPdfCount
}: {
  generatedAt: string;
  groups: DemoInventoryDocumentGroup[];
  priorityGroups: DemoInventoryDocumentGroup[];
  tenderId: string;
  textPdfCount: number;
  totalPdfCount: number;
}): WorkspaceOverviewView {
  const scheduleGroup = findDemoInventoryGroup(groups, "procurement_schedule");
  const instructionsGroup = findDemoInventoryGroup(
    groups,
    "instructions",
    "CM-X-OMRT3-TD-0020"
  );
  const pricesGroup = findDemoInventoryGroup(groups, "schedule_prices");
  const contractGroup =
    findDemoInventoryGroup(groups, "conditions_contract", "CM-X-OMRT3-TD-0011") ??
    findDemoInventoryGroup(groups, "contract_specification", "CM-X-OMRT3-TD-0010");

  return {
    detailsPanel: {
      kicker: "Pacchetto pubblico",
      rows: [
        { label: "Riferimento", value: "Copenhagen M1/M4 O&M" },
        { label: "Famiglie documentali", value: String(groups.length) },
        { label: "Aggiornato", value: new Date(generatedAt).toLocaleString("it-IT") },
        { label: "Testi PDF", value: `${textPdfCount}/${totalPdfCount}` }
      ],
      title: "Inventario"
    },
    metrics: [
      {
        detail: "Serve validazione umana prima di usare i dati",
        href: tenderRouteHref(tenderId, "review"),
        icon: "gauge",
        label: "Stato gara",
        tone: "risk",
        value: "Da controllare"
      },
      {
        detail: `${groups.length} famiglie documentali`,
        href: tenderRouteHref(tenderId, "documents"),
        icon: "layers",
        label: "Fonti prioritarie",
        tone: "risk",
        value: String(priorityGroups.length)
      },
      {
        detail: "Generate dall’inventario del pacchetto",
        href: tenderRouteHref(tenderId, "review"),
        icon: "clipboard-check",
        label: "Controlli aperti",
        tone: "risk",
        value: String(priorityGroups.length)
      },
      {
        detail: "Nessun invio automatico",
        href: tenderRouteHref(tenderId, "queries"),
        icon: "file-question",
        label: "Domande aperte",
        value: "0"
      }
    ],
    primaryActions: [
      {
        detail: "Apri la mappa documentale e verifica versioni, famiglie e fonti correnti.",
        href: tenderRouteHref(tenderId, "documents"),
        icon: "layers",
        title: "Controlla documenti"
      },
      {
        detail: "Passa dai controlli aperti prima di consolidare economia, scadenze o requisiti.",
        href: tenderRouteHref(tenderId, "review"),
        icon: "clipboard-check",
        title: "Apri controlli"
      },
      {
        detail: "Apri le sezioni operative per lavorare su scadenze, consegne ed economia.",
        href: tenderRouteHref(tenderId, "timeline"),
        icon: "calendar-days",
        title: "Passa alle sezioni operative"
      }
    ],
    priorityLinks: [
      {
        detail: scheduleGroup?.currentVersion.fileName ?? "Fonte non trovata nell’inventario.",
        href: scheduleGroup
          ? demoInventoryDocumentsPageHref(tenderId, scheduleGroup.currentVersion.id)
          : undefined,
        icon: "calendar-days",
        label: "Scadenze",
        title: "Date e versioni calendario"
      },
      {
        detail: instructionsGroup?.currentVersion.fileName ?? "Fonte non trovata nell’inventario.",
        href: instructionsGroup
          ? demoInventoryDocumentsPageHref(tenderId, instructionsGroup.currentVersion.id)
          : undefined,
        icon: "file-text",
        label: "Regole gara",
        title: "Istruzioni ai concorrenti"
      },
      {
        detail: pricesGroup?.currentVersion.fileName ?? "Fonte non trovata nell’inventario.",
        href: pricesGroup
          ? demoInventoryDocumentsPageHref(tenderId, pricesGroup.currentVersion.id)
          : undefined,
        icon: "file-spreadsheet",
        label: "Economia",
        title: "Workbook prezzi"
      },
      {
        detail: contractGroup?.currentVersion.fileName ?? "Fonte non trovata nell’inventario.",
        href: contractGroup
          ? demoInventoryDocumentsPageHref(tenderId, contractGroup.currentVersion.id)
          : undefined,
        icon: "check-circle",
        label: "Contratto",
        title: "Obblighi e specifiche"
      }
    ],
    routeItems: [
      {
        badge: "Da controllare",
        badgeVariant: "success",
        href: tenderRouteHref(tenderId, "documents"),
        label: "Documenti",
        value: `${groups.length} famiglie`
      },
      {
        badge: scheduleGroup ? "Fonte trovata" : "Bloccata",
        badgeVariant: scheduleGroup ? "success" : "risk",
        href: tenderRouteHref(tenderId, "timeline"),
        label: "Scadenze",
        value: scheduleGroup ? "Calendario PDF/MPP" : "Fonte calendario assente"
      },
      {
        badge: instructionsGroup ? "Da estrarre" : "Bloccata",
        badgeVariant: "risk",
        href: tenderRouteHref(tenderId, "deliverables"),
        label: "Consegne",
        value: "Formati, buste e obbligatorietà"
      },
      {
        badge: contractGroup ? "Da estrarre" : "Bloccata",
        badgeVariant: "risk",
        href: tenderRouteHref(tenderId, "requirements"),
        label: "Requisiti",
        value: "Specifiche e allegati O&M"
      },
      {
        badge: pricesGroup ? "Controllo umano" : "Bloccato",
        badgeVariant: "default",
        href: tenderRouteHref(tenderId, "financials"),
        label: "Economia",
        value: pricesGroup ? "Workbook prezzi presente" : "Workbook assente"
      },
      {
        badge: "Da derivare",
        badgeVariant: "muted",
        href: tenderRouteHref(tenderId, "cost-drivers"),
        label: "Costi",
        value: "Nessuna stima automatica"
      },
      {
        badge: "Da controllare",
        badgeVariant: "risk",
        href: tenderRouteHref(tenderId, "contradictions"),
        label: "Criticità",
        value: "Redline e versioni da confrontare"
      },
      {
        badge: "Non importato",
        badgeVariant: "muted",
        href: tenderRouteHref(tenderId, "queries"),
        label: "Domande",
        value: "Nessun invio automatico"
      }
    ]
  };
}

function buildLocalReviewItems(workspace: LocalTenderWorkspace): WorkspaceReviewItemView[] {
  return workspace.reviewItems.map((item) => {
    const sourceDocument = item.documentId
      ? workspace.documents.find((document) => document.id === item.documentId)
      : undefined;

    return {
      badges: [
        { label: item.risk, variant: riskVariant(item.risk) },
        { label: item.status, variant: reviewStatusVariant(item.status) }
      ],
      id: item.id,
      localAction: {
        reviewItemId: item.id,
        status: item.status,
        tenderId: workspace.tender.id
      },
      reason: item.reason,
      sourceHref: sourceDocument
        ? localDocumentsPageHref(workspace.tender.id, sourceDocument.id)
        : undefined,
      sourceLabel: sourceDocument?.fileName,
      title: item.title
    };
  });
}

function buildDemoInventoryReviewItems(
  groups: DemoInventoryDocumentGroup[],
  tenderId: string
): WorkspaceReviewItemView[] {
  return groups.map((group) => ({
    badges: [
      { label: priorityLabel(group.priority), variant: priorityVariant(group.priority) },
      { label: "Fonte prioritaria", variant: "muted" }
    ],
    id: group.id,
    reason: group.reviewFocus,
    sourceHref: demoInventoryDocumentsPageHref(tenderId, group.currentVersion.id),
    sourceLabel: group.currentVersion.fileName,
    title: formatDemoInventoryLabel(group.familyLabel)
  }));
}

function buildLocalAuditItems(workspace: LocalTenderWorkspace): WorkspaceAuditItemView[] {
  return workspace.auditEvents.map((event) => ({
    badge: { label: event.status, variant: event.status === "Completato" ? "success" : "risk" },
    detail: new Date(event.at).toLocaleString("it-IT"),
    id: event.id,
    title: event.label
  }));
}

function buildDemoInventoryAuditItems({
  fileCount,
  generatedAt,
  packageLabel,
  totalSizeBytes
}: {
  fileCount: number;
  generatedAt: string;
  packageLabel: string;
  totalSizeBytes: number;
}): WorkspaceAuditItemView[] {
  return [
    {
      badge: { label: "Completato", variant: "success" },
      detail: `${fileCount} file, ${formatBytes(totalSizeBytes)} inventariati`,
      id: "demo-inventory-audit-inventory",
      title: "Inventario pacchetto"
    },
    {
      badge: { label: "Completato", variant: "success" },
      detail: `Generato il ${new Date(generatedAt).toLocaleString("it-IT")}`,
      id: "demo-inventory-audit-generated",
      title: formatDemoInventoryLabel(packageLabel)
    },
    {
      badge: { label: "Da controllare", variant: "default" },
      detail:
        "I dati critici restano in controllo umano e nessuna domanda viene inviata automaticamente.",
      id: "demo-inventory-audit-rules",
      title: "Regole di validazione"
    }
  ];
}

function buildLocalWorkspaceViewModel({
  description,
  section,
  sourceId,
  tenderId,
  title,
  workspace
}: LocalWorkspaceViewModelInput): WorkspaceTenderViewModel {
  const selectedDocument = findLocalDocument(workspace, sourceId);
  const documentGroups = workspace.documents.map((document) =>
    buildLocalDocumentGroup(document, document.id === selectedDocument?.id, tenderId)
  );
  const currentDomainView = isDomainSection(section)
    ? buildDomainView({
        automationLabel: "Fonti candidate generate dal pacchetto locale",
        candidates: buildLocalDomainCandidates({
          documents: workspace.documents,
          section,
          tenderId
        }),
        section
      })
    : undefined;
  const openReviewCount = getOpenReviewCount(workspace);

  return {
    auditItems: buildLocalAuditItems(workspace),
    documentEmptyMessage:
      "Nessun documento caricato. Torna alla preparazione gara e crea un nuovo workspace con il pacchetto documentale.",
    documentGroups,
    domainView: currentDomainView,
    mode: "local",
    overview: buildLocalOverview(workspace),
    reviewEmptyMessage:
      "Nessun controllo aperto generato dall’inventario. Puoi iniziare dalle sezioni operative.",
    reviewItems: buildLocalReviewItems(workspace),
    selectedDocumentGroup: documentGroups.find((group) => group.id === selectedDocument?.id),
    shell: {
      currentSection: section,
      description,
      headerBadges: [
        {
          label: openReviewCount > 0 ? "Da controllare" : "Inventario pronto",
          variant: openReviewCount > 0 ? "risk" : "success"
        },
        { label: "Gara locale", variant: "default" }
      ],
      sectionEyebrow: section === "overview" ? "quadro gara" : title.toLowerCase(),
      sidebarBadges: [
        { label: workspace.tender.stage, variant: "default" },
        { label: workspace.tender.privacy, variant: "muted" }
      ],
      sidebarRows: [
        { label: "Documenti", value: String(workspace.documents.length) },
        { label: "Da controllare", value: String(openReviewCount) },
        { label: "Pacchetto", value: workspace.package.label }
      ],
      sidebarSubtitle: workspace.package.label,
      sidebarTitle: workspace.tender.name,
      statusLabel: "Locale",
      statusVariant: "default",
      tenderId,
      title
    }
  };
}

async function buildDemoInventoryWorkspaceViewModel({
  description,
  section,
  sourceId,
  tenderId,
  title,
  dataset
}: CphWorkspaceViewModelInput & {
  dataset: DemoInventoryWorkspaceDataset;
}): Promise<WorkspaceTenderViewModel> {
  if (!dataset.summary) {
    return {
      auditItems: [],
      documentEmptyMessage:
        "L’inventario locale non è disponibile. TRAM non può mostrare documenti o fonti finché la preparazione locale non viene completata.",
      documentGroups: [],
      mode: "demo-public",
      overview: {
        detailsPanel: {
          kicker: "Inventario",
          rows: [{ label: "Stato", value: "Non disponibile" }],
          title: "Gara non inizializzata"
        },
        metrics: [],
        primaryActions: [],
        priorityLinks: [],
        routeItems: []
      },
      reviewEmptyMessage: "Nessun controllo disponibile finché l’inventario non viene preparato.",
      reviewItems: [],
      shell: {
        currentSection: section,
        description:
          "L’inventario locale non è disponibile. TRAM non può mostrare documenti, fonti o controlli finché la preparazione locale non viene completata.",
        headerBadges: [
          { label: "Inventario assente", variant: "risk" },
          { label: "Documenti pubblici", variant: "success" }
        ],
        sectionEyebrow: sectionEyebrowLabels[section] ?? section,
        sidebarBadges: [
          { label: "Gara", variant: "default" },
          { label: "Documenti pubblici", variant: "muted" }
        ],
        sidebarRows: [
          { label: "File inventario", value: "0" },
          { label: "Fonti prioritarie", value: "0" },
          { label: "Fonte aperta", value: "Nessuna" }
        ],
        sidebarSubtitle: "Pacchetto Copenhagen M1/M4 O&M",
        sidebarTitle: dataset.title,
        statusLabel: "Inventario assente",
        statusVariant: "risk",
        tenderId,
        title: dataset.title
      }
    };
  }

  const groups = dataset.groups;
  const priorityGroups = groups.filter((group) => group.priority !== "normal");
  const sectionGroups =
    section === "documents"
      ? groups
      : isDomainSection(section)
        ? getDemoInventorySectionGroups({ groups, section, tenderId })
        : groups;
  const selectedGroup =
    findDemoInventoryGroupBySourceId(groups, sourceId) ?? sectionGroups[0] ?? groups[0];
  const selectedText = selectedGroup?.sourceTextVersion
    ? clipText(
        await readDemoWorkspaceTextExtract({
          documentId: selectedGroup.sourceTextVersion.id,
          tenderId
        })
      )
    : null;
  const documentGroups = groups.map((group) =>
    buildDemoInventoryDocumentGroup(
      group,
      group.id === selectedGroup?.id,
      group.id === selectedGroup?.id ? selectedText : null,
      tenderId
    )
  );
  const currentDomainView =
    isDomainSection(section)
      ? buildDomainView({
          automationLabel: "Inventario pubblico classificato per famiglie e versioni",
          candidates: buildDemoInventoryDomainCandidates({ groups, section, tenderId }),
          section
        })
      : undefined;

  return {
    auditItems: buildDemoInventoryAuditItems({
      fileCount: dataset.summary.fileCount,
      generatedAt: dataset.summary.generatedAt,
      packageLabel: dataset.summary.packageLabel,
      totalSizeBytes: dataset.summary.totalSizeBytes
    }),
    documentEmptyMessage:
      "Nessun documento disponibile nell’inventario pubblico di Copenhagen.",
    documentGroups,
    domainView: currentDomainView,
    mode: "demo-public",
    overview: buildDemoInventoryOverview({
      generatedAt: dataset.summary.generatedAt,
      groups,
      priorityGroups,
      tenderId,
      textPdfCount: dataset.textSummary?.extractedCount ?? 0,
      totalPdfCount: dataset.summary.extensionCounts[".pdf"] ?? 0
    }),
    reviewEmptyMessage: "Nessuna fonte prioritaria in controllo per questa gara.",
    reviewItems: buildDemoInventoryReviewItems(priorityGroups, tenderId),
    selectedDocumentGroup: documentGroups.find((group) => group.id === selectedGroup?.id),
    shell: {
      currentSection: section,
      description,
      headerBadges: [
        { label: "Da controllare", variant: "risk" },
        { label: "Documenti pubblici", variant: "success" }
      ],
      sectionEyebrow: sectionEyebrowLabels[section] ?? section,
      sidebarBadges: [
        { label: "Gara", variant: "default" },
        { label: "Documenti pubblici", variant: "muted" }
      ],
      sidebarRows: [
        { label: "File inventario", value: String(dataset.summary.fileCount) },
        { label: "Fonti prioritarie", value: String(priorityGroups.length) },
        {
          label: "Fonte aperta",
          value: selectedDemoInventoryDocumentGroupLabel(selectedGroup)
        }
      ],
      sidebarSubtitle: "Pacchetto Copenhagen M1/M4 O&M",
      sidebarTitle: dataset.title,
      statusLabel: "Da controllare",
      statusVariant: "risk",
      tenderId,
      title
    }
  };
}

function selectedDemoInventoryDocumentGroupLabel(group?: DemoInventoryDocumentGroup) {
  return group ? formatDemoInventoryLabel(group.familyLabel) : "Nessuna";
}

export async function readWorkspaceTenderViewModel(
  input: ReadWorkspaceTenderViewModelInput
): Promise<WorkspaceTenderViewModel | null> {
  const localWorkspace = await readLocalTenderWorkspace(input.tenderId);

  if (localWorkspace) {
    return buildLocalWorkspaceViewModel({ ...input, workspace: localWorkspace });
  }

  const demoDataset = await readDemoWorkspaceDataset(input.tenderId);

  if (!demoDataset) {
    return null;
  }

  if (demoDataset.kind === "fixture") {
    return buildFixtureWorkspaceViewModel({ ...input, dataset: demoDataset });
  }

  return buildDemoInventoryWorkspaceViewModel({ ...input, dataset: demoDataset });
}
