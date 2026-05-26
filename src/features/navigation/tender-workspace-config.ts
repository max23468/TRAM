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

export const dashboardStateLabels: Record<string, string> = {
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

export const privacyLabels: Record<string, string> = {
  L0: "Documenti pubblici",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

export const stageLabels: Record<string, string> = {
  addendum: "Addendum",
  "draft package": "Bozza documenti",
  negotiation: "Negoziazione",
  prequalification: "Prequalifica",
  "Revised tender": "Gara aggiornata"
};

export const riskLabels: Record<string, string> = {
  low: "Basso",
  medium: "Medio",
  high: "Alto",
  critical: "Critico"
};

export const statusLabels: Record<string, string> = {
  answered: "Risposto",
  blocked: "Bloccato",
  candidate: "Candidato",
  changed_by_qna: "Modificato da risposta",
  clarified_by_qna: "Precisato da risposta",
  confirmed: "Confermato",
  draft_question: "Bozza interna",
  human_review_required: "Richiede validazione",
  incorporated: "Incorporato",
  local_review_only: "Solo revisione interna",
  mapped: "Mappato",
  needs_owner: "Da assegnare",
  needs_review: "Da verificare",
  not_started: "Non avviato",
  open: "Aperto",
  proposed: "Proposto",
  ready: "Pronto",
  sent_to_authority: "Registrato su portale",
  structure_only: "Solo struttura",
  unclear: "Da chiarire",
  watch: "Da monitorare"
};

export const taskLabels: Record<string, string> = {
  T1: "Documenti",
  T2: "Scadenze",
  T3: "Consegne",
  T4: "Requisiti",
  T5: "Economia",
  T6: "Costi",
  T7: "Criticità",
  T8: "Domande/Risposte",
  audit: "Registro"
};

export const transportLabels: Record<string, string> = {
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

export function getRiskLabel(risk: string) {
  return riskLabels[risk] ?? risk;
}

export function getRiskVariant(risk: string): BadgeVariant {
  return risk === "high" || risk === "critical" ? "risk" : "muted";
}

export function getStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

export function getStatusVariant(status: string): BadgeVariant {
  if (["blocked", "needs_review", "needs_owner", "local_review_only"].includes(status)) {
    return "risk";
  }

  if (["confirmed", "mapped", "incorporated", "ready"].includes(status)) {
    return "success";
  }

  return "muted";
}

export function getTaskLabel(task: string) {
  return taskLabels[task] ?? task;
}

export function getTransportLabel(mode: string) {
  return transportLabels[mode] ?? mode;
}
