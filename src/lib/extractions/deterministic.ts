import type {
  DocumentPackageInventory,
  IngestionFileRecord,
  TechnicalSourceReference
} from "../ingestion";
import type { ExtractionCandidate, ExtractionRisk, ExtractionTask } from "./types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[_-]+/g, " ");
}

function firstSourceForFile(sourceReferences: TechnicalSourceReference[], fileId: string) {
  return sourceReferences.find((sourceReference) => sourceReference.fileId === fileId);
}

function routeForTask(task: ExtractionTask) {
  const routes: Record<ExtractionTask, string> = {
    T1: "documents",
    T2: "timeline",
    T3: "deliverables",
    T4: "requirements",
    T5: "financials",
    T6: "cost-drivers",
    T7: "contradictions",
    T8: "queries"
  };

  return routes[task];
}

function candidateId(task: ExtractionTask, file: IngestionFileRecord, suffix: string) {
  const safeSuffix = suffix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `ext_${task.toLowerCase()}_${file.id}_${safeSuffix || "source"}`;
}

function buildCandidate({
  description,
  file,
  risk,
  sourceReference,
  task,
  title
}: {
  description: string;
  file: IngestionFileRecord;
  risk: ExtractionRisk;
  sourceReference: TechnicalSourceReference;
  task: ExtractionTask;
  title: string;
}): ExtractionCandidate {
  const requiresReview = risk !== "low" || sourceReference.reviewStatus !== "not_required";

  return {
    id: candidateId(task, file, sourceReference.locator),
    tenderId: file.tenderId,
    packageId: file.packageId,
    task,
    title,
    description,
    status: requiresReview ? "needs_review" : "proposed",
    risk,
    confidence: risk === "low" ? 0.72 : 0.58,
    requiresReview,
    sourceReferenceId: sourceReference.id,
    evidenceKind: "technical_source_reference",
    parserKind: file.parserKind,
    aiPolicyStatus: "local_only",
    issueCodes: sourceReference.issueCodes,
    route: routeForTask(task)
  };
}

function classifyDocumentTitle(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  if (name.includes("price") || name.includes("pricing") || name.includes("payment")) {
    return "Documento economico o workbook prezzi candidato";
  }

  if (name.includes("schedule") || name.includes("programme") || file.parserKind === "mpp") {
    return "Documento calendario o programma candidato";
  }

  if (name.includes("form") || name.includes("submission") || name.includes("deliverable")) {
    return "Documento submission o deliverable candidato";
  }

  if (name.includes("contract") || name.includes("specification")) {
    return "Documento contrattuale o specifica candidato";
  }

  return "Documento di gara candidato";
}

function maybeTimelineCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return (
    file.parserKind === "mpp" ||
    name.includes("schedule") ||
    name.includes("programme") ||
    name.includes("timeline") ||
    name.includes("deadline")
  );
}

function maybeDeliverableCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return (
    name.includes("form") ||
    name.includes("submission") ||
    name.includes("deliverable") ||
    name.includes("tender") ||
    name.includes("instructions")
  );
}

export function extractT1T3Candidates({
  inventory,
  sourceReferences
}: {
  inventory: DocumentPackageInventory;
  sourceReferences: TechnicalSourceReference[];
}): ExtractionCandidate[] {
  const candidates: ExtractionCandidate[] = [];

  for (const file of inventory.files) {
    const sourceReference = firstSourceForFile(sourceReferences, file.id);

    if (!sourceReference) {
      continue;
    }

    candidates.push(
      buildCandidate({
        description:
          "Classificazione proposta da metadati file e source reference tecnica; non è verità consolidata.",
        file,
        risk: sourceReference.reviewStatus === "blocked" ? "high" : "low",
        sourceReference,
        task: "T1",
        title: classifyDocumentTitle(file)
      })
    );

    if (maybeTimelineCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile fonte timeline: date, timezone, durate e conflitti restano da parser/regole e review.",
          file,
          risk: "medium",
          sourceReference,
          task: "T2",
          title: "Timeline candidata da verificare"
        })
      );
    }

    if (maybeDeliverableCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile fonte deliverable: obbligatorietà, formato e deadline non sono dedotti dal filename.",
          file,
          risk: "medium",
          sourceReference,
          task: "T3",
          title: "Deliverable o submission candidate da verificare"
        })
      );
    }
  }

  return candidates;
}

function maybeRequirementCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return (
    name.includes("contract") ||
    name.includes("specification") ||
    name.includes("performance") ||
    name.includes("kpi") ||
    name.includes("safety") ||
    name.includes("cyber")
  );
}

function maybeFinancialCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return (
    name.includes("price") ||
    name.includes("pricing") ||
    name.includes("payment") ||
    name.includes("financial")
  );
}

function maybeCostDriverCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return (
    name.includes("fleet") ||
    name.includes("depot") ||
    name.includes("maintenance") ||
    name.includes("asset") ||
    name.includes("staff") ||
    name.includes("performance")
  );
}

function maybeClarificationCandidate(file: IngestionFileRecord) {
  const name = normalizeText(`${file.relativePath} ${file.fileName}`);

  return name.includes("q&a") || name.includes("qna") || name.includes("clarification");
}

export function extractT4T8Candidates({
  inventory,
  sourceReferences
}: {
  inventory: DocumentPackageInventory;
  sourceReferences: TechnicalSourceReference[];
}): ExtractionCandidate[] {
  const candidates: ExtractionCandidate[] = [];

  for (const file of inventory.files) {
    const sourceReference = firstSourceForFile(sourceReferences, file.id);

    if (!sourceReference) {
      continue;
    }

    if (maybeRequirementCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile requisito o KPI da validare: testo, soglie, mandatory status e formule restano alla review.",
          file,
          risk: "high",
          sourceReference,
          task: "T4",
          title: "Requisito o KPI candidato"
        })
      );
    }

    if (maybeFinancialCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile financial/payment mechanism: nessun importo o formula viene estratto come verità.",
          file,
          risk: "critical",
          sourceReference,
          task: "T5",
          title: "Financial item candidato"
        })
      );
    }

    if (maybeCostDriverCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile cost driver operativo: nessuna stima economica o assunzione d’offerta viene generata.",
          file,
          risk: "high",
          sourceReference,
          task: "T6",
          title: "Costo da controllare"
        })
      );
    }

    if (sourceReference.reviewStatus === "blocked" || file.status === "blocked") {
      candidates.push(
        buildCandidate({
          description:
            "Criticità candidata da parser issue: richiede controllo umano prima di usare il dato.",
          file,
          risk: "high",
          sourceReference,
          task: "T7",
          title: "Criticità candidata da issue parser"
        })
      );
    }

    if (maybeClarificationCandidate(file)) {
      candidates.push(
        buildCandidate({
          description:
            "Possibile registro o thread Q&A: nessuna domanda viene inviata o approvata automaticamente.",
          file,
          risk: "high",
          sourceReference,
          task: "T8",
          title: "Q&A candidato da validare"
        })
      );
    }
  }

  return candidates;
}

export function extractAllDeterministicCandidates(input: {
  inventory: DocumentPackageInventory;
  sourceReferences: TechnicalSourceReference[];
}) {
  return [...extractT1T3Candidates(input), ...extractT4T8Candidates(input)];
}
