export { copenhagenTenderId } from "@/lib/demo-workspace-constants";

export type BadgeVariant = "default" | "muted" | "risk" | "success";
export const demoTendersHref = "/tenders?vista=demo";

export const tenderNavigationSections = [
  { id: "overview", route: "overview", label: "Quadro" },
  { id: "documents", route: "documents", label: "Documenti" },
  { id: "timeline", route: "timeline", label: "Scadenze" },
  { id: "deliverables", route: "deliverables", label: "Consegne" },
  { id: "requirements", route: "requirements", label: "Requisiti" },
  { id: "financials", route: "financials", label: "Economia" },
  { id: "cost-drivers", route: "cost-drivers", label: "Costi" },
  { id: "contradictions", route: "contradictions", label: "Criticità" },
  { id: "clarifications", route: "queries", label: "Domande" },
  { id: "review", route: "review", label: "Controlli" },
  { id: "audit", route: "audit", label: "Registro" }
] as const;

export type TenderNavigationSection = (typeof tenderNavigationSections)[number];

const dashboardStateLabels: Record<string, string> = {
  draft: "Bozza",
  open_critical_issues: "Criticità aperte",
  partially_validated: "In controllo",
  stale_due_to_new_docs: "Documenti da aggiornare",
  validated_internal: "Controllata",
  review_required: "Controllo richiesto",
  stale_documents: "Documenti da aggiornare",
  policy_blocked: "Bloccata da regole dati",
  ready: "Pronto"
};

const privacyLabels: Record<string, string> = {
  L0: "Documenti pubblici",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

const stageLabels: Record<string, string> = {
  addendum: "Addendum",
  "draft package": "Bozza documenti",
  negotiation: "Negoziazione",
  prequalification: "Prequalifica",
  "Revised tender": "Gara aggiornata"
};

const transportLabels: Record<string, string> = {
  bus: "Bus",
  bus_depot: "Deposito e-bus",
  light_rail: "Light rail",
  metro: "Metro"
};

export function getDashboardStateLabel(state: string) {
  return dashboardStateLabels[state] ?? state;
}

export function getDashboardStateVariant(state: string): BadgeVariant {
  if (state === "validated_internal") {
    return "success";
  }

  if (state === "open_critical_issues" || state === "stale_due_to_new_docs") {
    return "risk";
  }

  return "muted";
}

export function getPrivacyLabel(level: string) {
  return privacyLabels[level] ?? level;
}

export function getPrivacyVariant(level: string): BadgeVariant {
  return level === "L2" ? "risk" : "muted";
}

export function getStageLabel(stage: string) {
  return stageLabels[stage] ?? stage;
}

export function getTransportLabel(mode: string) {
  return transportLabels[mode] ?? mode;
}
