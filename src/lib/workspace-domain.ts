import type { DemoInventoryDocumentGroup } from "./demo-workspace";
import type { LocalTenderDocument, LocalTenderWorkspace } from "./local-workspace/types";

type BadgeVariant = "default" | "muted" | "risk" | "success";

export type WorkspaceDomainSection =
  | "timeline"
  | "deliverables"
  | "requirements"
  | "financials"
  | "cost-drivers"
  | "contradictions"
  | "queries";

export type WorkspaceDomainCandidate = {
  id: string;
  priorityLabel: string;
  priorityVariant: BadgeVariant;
  sourceHref: string;
  sourceLabel: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  summary: string;
  tags: string[];
  title: string;
};

export type WorkspaceDomainStatusCard = {
  badge: string;
  badgeVariant: BadgeVariant;
  href: string;
  label: string;
  value: string;
};

type LocalCandidateInput = {
  documents: LocalTenderDocument[];
  section: WorkspaceDomainSection;
  tenderId: string;
};

type CphCandidateInput = {
  groups: DemoInventoryDocumentGroup[];
  section: WorkspaceDomainSection;
  tenderId: string;
};

type SectionRule = {
  emptyBadge: string;
  emptyValue: string;
  label: string;
  matchedBadge: string;
  matchedValue: (count: number) => string;
  noCandidateMessage: string;
  purpose: string;
  sourceHint: string;
  statusVariant: BadgeVariant;
  keywords: string[];
};

const sectionRules: Record<WorkspaceDomainSection, SectionRule> = {
  contradictions: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessun confronto versioni",
    keywords: ["addendum", "redline", "clarification", "question", "correction", "rev"],
    label: "Criticità",
    matchedBadge: "Da controllare",
    matchedValue: (count) => `${count} confronti da verificare`,
    noCandidateMessage: "Nessuna fonte candidata per criticità e contraddizioni.",
    purpose: "Confrontare versioni, chiarimenti e possibili incoerenze prima di usarle nel quadro gara.",
    sourceHint: "Apri i documenti da confrontare",
    statusVariant: "risk"
  },
  "cost-drivers": {
    emptyBadge: "Da derivare",
    emptyValue: "Nessuna fonte costo candidata",
    keywords: ["cost", "resource", "staff", "asset", "depot", "maintenance", "fleet"],
    label: "Costi",
    matchedBadge: "Da derivare",
    matchedValue: (count) => `${count} fonti per costi e risorse`,
    noCandidateMessage: "Nessuna fonte candidata per costi, risorse o asset.",
    purpose: "Capire quali documenti parlano di risorse, manutenzione, personale o asset prima di stimare impatti.",
    sourceHint: "Apri le fonti costo",
    statusVariant: "muted"
  },
  deliverables: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessuna fonte submission",
    keywords: ["deliverable", "submission", "form", "template", "attachment", "instruction", "tender"],
    label: "Consegne",
    matchedBadge: "Da estrarre",
    matchedValue: (count) => `${count} fonti per buste e allegati`,
    noCandidateMessage: "Nessuna fonte candidata per consegne, moduli o allegati.",
    purpose: "Individuare moduli, allegati, formati e regole di submission partendo da fonti candidate.",
    sourceHint: "Apri i documenti submission",
    statusVariant: "risk"
  },
  financials: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessuna fonte economica",
    keywords: ["price", "pricing", "payment", "financial", "penalty", "invoice", "cost", "commercial"],
    label: "Economia",
    matchedBadge: "Controllo umano",
    matchedValue: (count) => `${count} fonti prezzi e pagamento`,
    noCandidateMessage: "Nessuna fonte candidata per prezzi, pagamento o penali.",
    purpose: "Raccogliere workbook, schedule of prices e documenti economici senza consolidare valori non validati.",
    sourceHint: "Apri le fonti economiche",
    statusVariant: "default"
  },
  queries: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessun registro domande",
    keywords: ["q&a", "qa", "clarification", "question", "answer", "faq", "response"],
    label: "Domande",
    matchedBadge: "Da incorporare",
    matchedValue: (count) => `${count} fonti per chiarimenti`,
    noCandidateMessage: "Nessuna fonte candidata per domande, risposte o chiarimenti.",
    purpose: "Raccogliere registri Q&A o addendum che possono cambiare documenti, scadenze o submission.",
    sourceHint: "Apri le fonti chiarimenti",
    statusVariant: "default"
  },
  requirements: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessuna fonte requisiti",
    keywords: ["requirement", "specification", "service", "technical", "contract", "kpi", "operations"],
    label: "Requisiti",
    matchedBadge: "Da estrarre",
    matchedValue: (count) => `${count} fonti per specifiche e KPI`,
    noCandidateMessage: "Nessuna fonte candidata per requisiti, specifiche o KPI.",
    purpose: "Riconoscere specifiche, obblighi operativi e KPI da cui partire per la validazione.",
    sourceHint: "Apri le specifiche candidate",
    statusVariant: "risk"
  },
  timeline: {
    emptyBadge: "Da costruire",
    emptyValue: "Nessun calendario candidato",
    keywords: [
      "procurement schedule",
      "implementation programme",
      "implementation program",
      "deadline",
      "calendar",
      "mpp",
      "timeline",
      "scaden",
      "milestone"
    ],
    label: "Scadenze",
    matchedBadge: "Fonte trovata",
    matchedValue: (count) => `${count} fonti per date e milestone`,
    noCandidateMessage: "Nessuna fonte candidata per calendario, date o milestone.",
    purpose: "Partire dai documenti che parlano di calendario, milestone o submission date.",
    sourceHint: "Apri i calendari candidati",
    statusVariant: "success"
  }
};

const demoInventoryFamilyMap: Record<WorkspaceDomainSection, string[]> = {
  contradictions: ["procurement_schedule", "instructions", "conditions_contract", "contract_specification"],
  "cost-drivers": ["payment_mechanism", "maintenance", "traffic_operations", "transition"],
  deliverables: ["instructions", "form_tender", "commitment_letters", "subcontractors"],
  financials: ["schedule_prices", "payment_mechanism", "conditions_contract"],
  queries: ["instructions", "procurement_schedule", "conditions_contract", "data_processing"],
  requirements: ["contract_specification", "traffic_operations", "passenger_information", "maintenance"],
  timeline: ["procurement_schedule", "instructions", "transition"]
};

function normalizeFileLabel(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function statusVariantFromDocument(document: LocalTenderDocument): BadgeVariant {
  if (document.status === "Pronto per il parsing") {
    return "success";
  }

  if (document.status === "Verifica OCR") {
    return "default";
  }

  return "risk";
}

function getLocalPriorityLabel(document: LocalTenderDocument, score: number) {
  if (document.status !== "Pronto per il parsing" || score >= 10) {
    return { label: "Alta priorità", variant: "risk" as const };
  }

  if (score >= 6) {
    return { label: "Priorità media", variant: "default" as const };
  }

  return { label: "Priorità normale", variant: "muted" as const };
}

function localMatchScore(section: WorkspaceDomainSection, document: LocalTenderDocument) {
  const rule = sectionRules[section];
  const haystack = `${document.fileName} ${document.relativePath}`.toLowerCase();
  const normalizedHaystack = haystack.replace(/[_-]+/g, " ");
  const keywordHits = rule.keywords.reduce(
    (total, keyword) => total + (normalizedHaystack.includes(keyword) ? 1 : 0),
    0
  );

  let score = keywordHits * 3;

  if (section === "timeline" && document.extension === ".mpp") {
    score += 8;
  }

  if (section === "financials" && [".xlsx", ".xls", ".csv"].includes(document.extension)) {
    score += 5;
  }

  if (section === "queries" && haystack.includes("clarification")) {
    score += 2;
  }

  return score;
}

function buildLocalSummary(section: WorkspaceDomainSection, document: LocalTenderDocument) {
  const label = normalizeFileLabel(document.fileName);

  if (section === "timeline") {
    return `${label}: verificare date, milestone e versione corrente partendo da ${document.parserLabel.toLowerCase()}.`;
  }

  if (section === "deliverables") {
    return `${label}: probabile fonte per buste, allegati, moduli o regole di consegna.`;
  }

  if (section === "requirements") {
    return `${label}: possibile fonte per specifiche, obblighi operativi o KPI da trasformare in item verificabili.`;
  }

  if (section === "financials") {
    return `${label}: documento utile per prezzi, payment mechanism o penali; dati da validare prima dell’uso.`;
  }

  if (section === "cost-drivers") {
    return `${label}: fonte utile per risorse, manutenzione, asset o personale con impatto sul lavoro d’offerta.`;
  }

  if (section === "contradictions") {
    return `${label}: da confrontare con versioni, addendum o chiarimenti per verificare incoerenze.`;
  }

  return `${label}: possibile fonte per chiarimenti, correzioni o risposte da incorporare nel quadro gara.`;
}

function buildLocalTags(document: LocalTenderDocument) {
  return [
    document.parserLabel,
    document.extension.replace(".", "").toUpperCase(),
    document.status
  ];
}

export function getWorkspaceDomainLabel(section: WorkspaceDomainSection) {
  return sectionRules[section].label;
}

export function getWorkspaceDomainRule(section: WorkspaceDomainSection) {
  return sectionRules[section];
}

export function buildLocalDomainCandidates({
  documents,
  section,
  tenderId
}: LocalCandidateInput): WorkspaceDomainCandidate[] {
  const matched = documents
    .map((document) => ({ document, score: localMatchScore(section, document) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.document.fileName.localeCompare(right.document.fileName))
    .slice(0, 6);

  return matched.map(({ document, score }) => {
    const priority = getLocalPriorityLabel(document, score);

    return {
      id: `${section}:${document.id}`,
      priorityLabel: priority.label,
      priorityVariant: priority.variant,
      sourceHref: `/tenders/${tenderId}/documents?source=${encodeURIComponent(document.id)}`,
      sourceLabel: document.fileName,
      statusLabel: document.status,
      statusVariant: statusVariantFromDocument(document),
      summary: buildLocalSummary(section, document),
      tags: buildLocalTags(document),
      title: normalizeFileLabel(document.fileName)
    };
  });
}

export function buildLocalRouteStatusCards(
  workspace: LocalTenderWorkspace
): WorkspaceDomainStatusCard[] {
  const sections: WorkspaceDomainSection[] = [
    "timeline",
    "deliverables",
    "requirements",
    "financials",
    "cost-drivers",
    "contradictions",
    "queries"
  ];

  return sections.map((section) => {
    const rule = sectionRules[section];
    const count = buildLocalDomainCandidates({
      documents: workspace.documents,
      section,
      tenderId: workspace.tender.id
    }).length;

    return {
      badge: count > 0 ? rule.matchedBadge : rule.emptyBadge,
      badgeVariant: count > 0 ? rule.statusVariant : "muted",
      href: `/tenders/${workspace.tender.id}/${section}`,
      label: rule.label,
      value: count > 0 ? rule.matchedValue(count) : rule.emptyValue
    };
  });
}

function demoInventoryPriorityVariant(priority: DemoInventoryDocumentGroup["priority"]): BadgeVariant {
  return priority === "critical" ? "risk" : priority === "high" ? "default" : "muted";
}

function demoInventoryPriorityLabel(priority: DemoInventoryDocumentGroup["priority"]) {
  if (priority === "critical") {
    return "Alta priorità";
  }

  if (priority === "high") {
    return "Priorità media";
  }

  return "Priorità normale";
}

function formatDemoInventoryLabel(value: string) {
  return value
    .replace(/\bCPH\b/g, "Copenhagen")
    .replace(/\bTimeline\b/g, "Scadenze")
    .replace(/\bDeliverables?\b/g, "Consegne")
    .replace(/\bFinancials\b/g, "Economia")
    .replace(/\bCost driver\b/g, "Costi");
}

export function getDemoInventorySectionGroups({
  groups,
  section
}: CphCandidateInput): DemoInventoryDocumentGroup[] {
  const families = demoInventoryFamilyMap[section];
  const matched = groups.filter((group) => families.includes(group.familyKey));

  return (matched.length > 0 ? matched : groups).slice(0, 8);
}

export function buildDemoInventoryDomainCandidates({
  groups,
  section,
  tenderId
}: CphCandidateInput): WorkspaceDomainCandidate[] {
  return getDemoInventorySectionGroups({ groups, section, tenderId }).map((group) => ({
    id: `${section}:${group.id}`,
    priorityLabel: demoInventoryPriorityLabel(group.priority),
    priorityVariant: demoInventoryPriorityVariant(group.priority),
    sourceHref: `/tenders/${tenderId}/documents?source=${encodeURIComponent(
      group.currentVersion.id
    )}`,
    sourceLabel: group.currentVersion.fileName,
    statusLabel: group.priority === "normal" ? "Fonte raccolta" : "Da controllare",
    statusVariant: group.priority === "normal" ? "success" : "risk",
    summary: group.reviewFocus,
    tags: [group.areaLabel, ...group.formats],
    title: formatDemoInventoryLabel(group.familyLabel)
  }));
}
