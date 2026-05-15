import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  FileQuestion,
  FileSpreadsheet,
  Gauge,
  Layers3,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DismissibleNotice } from "@/components/ui/dismissible-notice";
import { QnaRegisterView } from "@/features/navigation/qna-register-view";
import { TenderSideNav } from "@/features/navigation/tender-side-nav";
import { TenderRouteStrip } from "@/features/navigation/tender-route-strip";
import {
  getSourceReferenceById,
  getTenderOverviewModel,
  type TramClarificationThread,
  type TramDocument,
  type TramIndicator,
  type TramReviewItem,
  type TramSourceReference
} from "@/lib/fixtures";

type TenderSectionPageProps = {
  tenderId: string;
  section: string;
  title: string;
  description: string;
};

const navigationSections = [
  { id: "overview", route: "overview", label: "Dashboard" },
  { id: "documents", route: "documents", label: "Documenti" },
  { id: "timeline", route: "timeline", label: "Timeline" },
  { id: "deliverables", route: "deliverables", label: "Deliverables" },
  { id: "requirements", route: "requirements", label: "Requisiti" },
  { id: "financials", route: "financials", label: "Financials" },
  { id: "cost-drivers", route: "cost-drivers", label: "Cost driver" },
  { id: "contradictions", route: "contradictions", label: "Criticità" },
  { id: "clarifications", route: "queries", label: "Q&A" },
  { id: "review", route: "review", label: "Da validare" },
  { id: "audit", route: "audit", label: "Registro attività" }
] as const;

const dashboardStateLabels: Record<string, string> = {
  draft: "Bozza",
  open_critical_issues: "Criticità aperte",
  partially_validated: "Validazione parziale",
  stale_due_to_new_docs: "Stale per nuovi documenti",
  validated_internal: "Validato internamente",
  // Etichette legacy mantenute solo per eventuali fixture vecchie durante sviluppo locale.
  review_required: "Validazione richiesta",
  stale_documents: "Documenti da aggiornare",
  policy_blocked: "Policy bloccante",
  ready: "Pronto"
};

const privacyLabels: Record<string, string> = {
  L0: "Pubblico",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

const documentStateLabels: Record<string, string> = {
  current: "Vigente",
  under_review: "Da verificare",
  superseded: "Superato"
};

const indicatorValueLabels: Record<string, string> = {
  qna_changes_pending_review: "Q&A da incorporare",
  partial_missing_attachment: "Set parziale, allegato mancante",
  stale: "Documenti non allineati",
  blocked_l2: "AI esterna bloccata"
};

const statusLabels: Record<string, string> = {
  answered: "Risposto",
  blocked: "Bloccato",
  candidate: "Candidato",
  changed_by_qna: "Modificato da Q&A",
  clarified_by_qna: "Precisato da Q&A",
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
  watch: "Da monitorare"
};

const sectionEyebrowLabels: Record<string, string> = {
  audit: "registro attività",
  contradictions: "criticità",
  "cost-drivers": "cost driver",
  deliverables: "deliverables",
  documents: "documenti",
  financials: "financials",
  overview: "dashboard",
  queries: "q&a",
  requirements: "requisiti",
  review: "da validare",
  timeline: "timeline"
};

const threadStatusLabels: Record<TramClarificationThread["status"], string> = {
  draft_question: "Bozza interna",
  sent_to_authority: "Registrato su portale",
  answered: "Risposto",
  incorporated: "Incorporato",
  blocked: "Bloccato"
};

type BadgeVariant = "default" | "muted" | "risk" | "success";
type TenderOverviewModel = ReturnType<typeof getTenderOverviewModel>;

function riskVariant(risk: TramReviewItem["risk"] | "low" | "medium" | "high" | "critical"): BadgeVariant {
  return risk === "high" || risk === "critical" ? "risk" : "muted";
}

function statusVariant(status: string): BadgeVariant {
  if (["blocked", "needs_review", "needs_owner", "local_review_only"].includes(status)) {
    return "risk";
  }

  if (["confirmed", "mapped", "incorporated", "ready"].includes(status)) {
    return "success";
  }

  return "muted";
}

function threadVariant(status: TramClarificationThread["status"]): BadgeVariant {
  if (status === "blocked") {
    return "risk";
  }

  if (status === "incorporated") {
    return "success";
  }

  return "muted";
}

function getIndicator(indicators: TramIndicator[], key: string) {
  return indicators.find((indicator) => indicator.key === key);
}

function humanizeIndicatorValue(value: string) {
  return indicatorValueLabels[value] ?? value;
}

function formatStatus(status: string) {
  return statusLabels[status] ?? status;
}

function getSourceLabel(sourceReferenceId: string) {
  const sourceReference = getSourceReferenceById(sourceReferenceId);

  return sourceReference?.label ?? "Fonte demo non trovata";
}

function sectionHref(tenderId: string, route: string) {
  return `/tenders/${tenderId}/${route}`;
}

export function TenderSectionPage({
  tenderId,
  section,
  title,
  description
}: TenderSectionPageProps) {
  const model = getTenderOverviewModel(tenderId);
  const { tender } = model;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <nav className="flex items-center justify-between border-b border-border pb-4">
        <Link className="text-sm font-medium text-muted-foreground" href="/tenders">
          Tender
        </Link>
        <Badge variant="muted">Demo MVP</Badge>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-6 lg:self-start">
          <p className="text-xs font-medium uppercase text-muted-foreground">Tender</p>
          <h2 className="mt-2 text-base font-semibold">{tender.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tender.package_label}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{tender.stage}</Badge>
            <Badge variant={tender.privacy_level === "L2" ? "risk" : "muted"}>
              {privacyLabels[tender.privacy_level] ?? tender.privacy_level}
            </Badge>
          </div>

          <TenderSideNav
            key={section}
            currentSection={section}
            sections={navigationSections}
            tenderId={tender.id}
          />
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <section id={section === "overview" ? "overview" : undefined} className="scroll-mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {sectionEyebrowLabels[section] ?? section}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="muted">
                {dashboardStateLabels[tender.dashboard_state] ?? tender.dashboard_state}
              </Badge>
              <Badge variant="success">Demo sanificata</Badge>
            </div>
          </section>

          {section === "overview" ? (
            <DashboardView model={model} />
          ) : section === "queries" ? (
            <ClarificationsView model={model} />
          ) : (
            <FullSectionView model={model} section={section} />
          )}
        </div>
      </div>
    </main>
  );
}

function DashboardView({ model }: { model: TenderOverviewModel }) {
  const qnaCoverage = getIndicator(model.indicators, "clarifications.register_coverage_status");
  const documentStatus = getIndicator(model.indicators, "documents.currentness_status");
  const dashboardState = getIndicator(model.indicators, "dashboard.validation_state.overall");
  const blockingCount = getIndicator(model.indicators, "review.blocking_count");
  const financialsStatus = getIndicator(model.indicators, "financials.payment_mechanism_status");
  const openP0Count = model.indicators.filter(
    (indicator) => indicator.priority === "P0" && indicator.status !== "confirmed"
  ).length;
  const blockingCountValue =
    blockingCount?.value ??
    String(model.reviewItems.filter((item) => ["blocked", "needs_owner", "open"].includes(item.status)).length);
  const primaryReview =
    model.reviewItems.find((item) => item.status === "blocked") ??
    model.reviewItems.find((item) => item.risk === "critical" || item.risk === "high") ??
    model.reviewItems[0];
  const primarySource = primaryReview ? getSourceReferenceById(primaryReview.source_reference_id) : undefined;
  const decisionItems = [
    ...model.reviewItems
      .filter((item) => ["blocked", "needs_owner", "open", "contested"].includes(item.status))
      .map((item) => ({
        id: item.id,
        eyebrow: "Review",
        title: item.title,
        detail: `${formatStatus(item.status)} · ${getSourceLabel(item.source_reference_id)}`,
        href: sectionHref(model.tender.id, "review"),
        badge: item.risk,
        badgeVariant: riskVariant(item.risk)
      })),
    ...model.clarificationThreads
      .filter((thread) => thread.requires_dashboard_update || thread.status === "blocked")
      .map((thread) => ({
        id: thread.id,
        eyebrow: "Q&A",
        title: thread.title,
        detail: thread.blocked_reason ?? `${threadStatusLabels[thread.status]} · impatto dashboard`,
        href: sectionHref(model.tender.id, "queries"),
        badge: threadStatusLabels[thread.status],
        badgeVariant: threadVariant(thread.status)
      }))
  ].slice(0, 5);
  const hasClarificationAlert =
    model.dashboardUpdateCount > 0 || model.blockedClarificationCount > 0;
  const hasFinancialsAlert = financialsStatus?.value === "human_review_required";

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Metriche headline">
        <MetricCard
          href={sectionHref(model.tender.id, "review")}
          icon={Gauge}
          label="Stato dashboard"
          value={dashboardStateLabels[model.tender.dashboard_state] ?? model.tender.dashboard_state}
          detail={dashboardState ? formatStatus(dashboardState.status) : "Derivato da review e fonti"}
        />
        <MetricCard
          href={sectionHref(model.tender.id, "documents")}
          icon={Layers3}
          label="Fonti P0 da verificare"
          value={String(openP0Count)}
          detail={
            documentStatus
              ? humanizeIndicatorValue(documentStatus.value)
              : "Nessuna fonte P0 in stato aperto"
          }
        />
        <MetricCard
          href={sectionHref(model.tender.id, "review")}
          icon={ClipboardCheck}
          label="Blocchi attivi"
          value={blockingCountValue}
          detail={`${model.needsReviewCount} item in coda review`}
        />
        <MetricCard
          href={sectionHref(model.tender.id, "queries")}
          icon={FileQuestion}
          label="Q&A con impatto"
          value={String(model.clarificationThreads.length)}
          detail={qnaCoverage ? humanizeIndicatorValue(qnaCoverage.value) : "Nessun registro Q&A"}
        />
      </section>

      <TenderRouteStrip network={model.routeNetwork} />

      {hasClarificationAlert ? (
        <DismissibleNotice className="rounded-lg border border-amber-300 bg-amber-50 p-4 pr-10 text-amber-950">
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
            <div>
              <h2 className="text-sm font-semibold">Q&A da incorporare</h2>
              <p className="mt-1 text-sm leading-6">
                Il registro Q&A contiene una correzione che può cambiare lo stato dei documenti e
                un allegato citato ma non ancora presente. La dashboard resta in validazione finché
                questi elementi non sono validati.
              </p>
            </div>
          </div>
        </DismissibleNotice>
      ) : null}

      {hasFinancialsAlert ? (
        <DismissibleNotice className="rounded-lg border border-border bg-card p-4 pr-10">
          <div className="flex gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={20} />
            <div>
              <h2 className="text-sm font-semibold">Financials in revisione controllata</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Il meccanismo di remunerazione richiede validazione umana. L’overview mostra solo
                stato e gate, senza valori economici non consolidati.
              </p>
            </div>
          </div>
        </DismissibleNotice>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <DecisionList items={decisionItems} tenderId={model.tender.id} />
          <section id="review" className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">Da validare</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Priorità operative</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Coda corta ordinata per blocco, rischio e fonte collegata.
                </p>
              </div>
              <Link className="text-sm font-medium text-primary hover:underline" href={sectionHref(model.tender.id, "review")}>
                Apri review
              </Link>
            </div>
            <div className="grid gap-3">
              {model.reviewItems.slice(0, 4).map((item) => (
                <ReviewItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <SourceInspector
          reviewItem={primaryReview}
          source={primarySource}
          tenderId={model.tender.id}
        />
      </section>
    </>
  );
}

function FullSectionView({
  model,
  section
}: {
  model: TenderOverviewModel;
  section: string;
}) {
  if (section === "documents") {
    return (
      <SectionBlock id="documents" title="Documenti" description="Famiglie, versioni e stato di aggiornamento del set caricato.">
        <DocumentsList documents={model.documents} />
      </SectionBlock>
    );
  }

  if (section === "timeline") {
    return (
      <SectionBlock id="timeline" title="Timeline" description="Eventi principali e scadenze da tenere sotto controllo.">
        <TimelineList events={model.timelineEvents} />
      </SectionBlock>
    );
  }

  if (section === "deliverables") {
    return (
      <SectionBlock id="deliverables" title="Deliverables" description="Cosa deve essere preparato e in quale busta o area di submission.">
        <SimpleGrid>
          {model.deliverables.map((deliverable) => (
            <SimpleItem
              key={deliverable.id}
              title={deliverable.title}
              meta={`${deliverable.envelope} · ${getSourceLabel(deliverable.source_reference_id)}`}
              badge={formatStatus(deliverable.status)}
              badgeVariant={statusVariant(deliverable.status)}
            />
          ))}
        </SimpleGrid>
      </SectionBlock>
    );
  }

  if (section === "requirements") {
    return (
      <SectionBlock id="requirements" title="Requisiti" description="Requisiti operativi e KPI non economici emersi dalla documentazione.">
        <SimpleGrid>
          {model.requirements.map((requirement) => (
            <SimpleItem
              key={requirement.id}
              title={requirement.title}
              meta={`${requirement.domain} · ${getSourceLabel(requirement.source_reference_id)}`}
              badge={formatStatus(requirement.status)}
              badgeVariant={riskVariant(requirement.risk)}
            />
          ))}
        </SimpleGrid>
      </SectionBlock>
    );
  }

  if (section === "financials") {
    return (
      <SectionBlock id="financials" title="Financials" description="Meccanismo di remunerazione, struttura dei prezzi e voci economiche collegate a fonti e stato di validazione.">
        <SimpleGrid>
          {model.financialItems.map((item) => (
            <SimpleItem
              key={item.id}
              title={item.title}
              meta={`Sensibilità ${item.sensitivity} · ${getSourceLabel(item.source_reference_id)}`}
              badge={formatStatus(item.status)}
              badgeVariant="risk"
            />
          ))}
        </SimpleGrid>
      </SectionBlock>
    );
  }

  if (section === "cost-drivers") {
    return (
      <SectionBlock id="cost-drivers" title="Cost driver" description="Fattori che possono influenzare costo, rischio o effort dell’offerta.">
        <SimpleGrid>
          {model.costDrivers.map((driver) => (
            <SimpleItem
              key={driver.id}
              title={driver.title}
              meta={`${driver.category} · ${getSourceLabel(driver.source_reference_id)}`}
              badge={formatStatus(driver.status)}
              badgeVariant={statusVariant(driver.status)}
            />
          ))}
        </SimpleGrid>
      </SectionBlock>
    );
  }

  if (section === "contradictions") {
    return (
      <SectionBlock id="contradictions" title="Criticità" description="Incoerenze, gap e conflitti candidati: non diventano verità finché non passano da validazione.">
        <div className="grid gap-3">
          {model.contradictions.map((contradiction) => (
            <SimpleItem
              key={contradiction.id}
              title={contradiction.title}
              meta={contradiction.source_reference_ids.map(getSourceLabel).join(" · ")}
              badge={formatStatus(contradiction.status)}
              badgeVariant={riskVariant(contradiction.risk)}
            />
          ))}
        </div>
      </SectionBlock>
    );
  }

  if (section === "review") {
    return (
      <SectionBlock id="review" title="Da validare" description="Coda prioritaria per validare, bloccare o correggere dati proposti.">
        <div className="grid gap-3">
          {model.reviewItems.map((item) => (
            <ReviewItemRow key={item.id} item={item} />
          ))}
        </div>
      </SectionBlock>
    );
  }

  if (section === "audit") {
    return (
      <SectionBlock id="audit" title="Registro attività" description="Eventi applicativi e policy sul dataset demo.">
        <AuditContent />
      </SectionBlock>
    );
  }

  return (
    <SectionBlock id={section} title="Sezione" description="Vista demo da completare.">
      <p className="text-sm text-muted-foreground">Nessun contenuto dedicato per questa sezione.</p>
    </SectionBlock>
  );
}

function ClarificationsView({ model }: { model: TenderOverviewModel }) {
  return <ClarificationsContent model={model} qnaImport={model.clarificationImports[0]} />;
}

function ClarificationsContent({
  model,
  qnaImport
}: {
  model: TenderOverviewModel;
  qnaImport: TenderOverviewModel["clarificationImports"][number] | undefined;
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <FileSpreadsheet aria-hidden="true" className="text-primary" size={18} />
          <h2 className="text-sm font-semibold">Registro Q&A importato</h2>
        </div>

        {qnaImport ? (
          <>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {qnaImport.source_filename}
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Righe" value={String(qnaImport.row_count)} />
              <InfoRow label="Q&A" value={String(qnaImport.clarification_count)} />
              <InfoRow label="Correzioni" value={String(qnaImport.correction_count)} />
              <InfoRow label="Senza rif." value={String(qnaImport.rows_without_document_reference_count)} />
              <InfoRow label="Allegati mancanti" value={String(qnaImport.missing_attachment_count)} />
              <InfoRow label="Stato" value={formatStatus(qnaImport.import_status)} />
            </dl>
            <div className="mt-4 rounded-md border border-border bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">Colonne riconosciute</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.values(qnaImport.column_map).map((column) => (
                  <Badge key={column} variant="muted">
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Nessun registro Q&A collegato.</p>
        )}
      </section>

      <QnaRegisterView threads={model.clarificationThreads} />
    </div>
  );
}

function DocumentsList({ documents }: { documents: TramDocument[] }) {
  return (
    <div className="grid gap-3">
      {documents.map((document) => (
        <div key={document.id} className="grid gap-2 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-medium">{document.title}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {document.family} · {document.version}
            </p>
          </div>
          <Badge variant={document.currentness === "current" ? "success" : "muted"}>
            {documentStateLabels[document.currentness] ?? document.currentness}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function TimelineList({
  events
}: {
  events: TenderOverviewModel["timelineEvents"];
}) {
  return (
    <ol className="relative grid gap-4 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:w-px before:bg-border">
      {events.map((event) => (
        <li key={event.id} className="relative pl-8">
          <span className="absolute left-0 top-4 h-[19px] w-[19px] rounded-full border border-primary bg-background ring-4 ring-background" />
          <article className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {event.date_label}
                </p>
                <h3 className="mt-1 text-sm font-semibold leading-5">{event.title}</h3>
              </div>
              <Badge variant={riskVariant(event.impact)}>{formatStatus(event.status)}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {getSourceLabel(event.source_reference_id)}
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}

type DecisionItem = {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  badge: string;
  badgeVariant: BadgeVariant;
};

function DecisionList({ items, tenderId }: { items: DecisionItem[]; tenderId: string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">Decisioni</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Prossime decisioni</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Solo elementi che cambiano stato, scadenze o lavoro dell’offerta.
          </p>
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={sectionHref(tenderId, "review")}>
          Apri coda
        </Link>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-muted/40">
        {items.map((item) => (
          <Link
            key={item.id}
            className="grid gap-2 px-4 py-3 transition-colors hover:bg-muted md:grid-cols-[88px_minmax(0,1fr)_auto] md:items-center"
            href={item.href}
          >
            <span className="font-mono text-[10px] uppercase text-muted-foreground">{item.eyebrow}</span>
            <span>
              <span className="block text-sm font-medium leading-5 text-foreground">{item.title}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.detail}</span>
            </span>
            <Badge variant={item.badgeVariant}>{item.badge}</Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SourceInspector({
  reviewItem,
  source,
  tenderId
}: {
  reviewItem: TramReviewItem | undefined;
  source: TramSourceReference | undefined;
  tenderId: string;
}) {
  return (
    <aside className="rounded-lg border border-border bg-card p-5 xl:sticky xl:top-6 xl:self-start">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">Fonte aperta</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            {reviewItem?.title ?? "Nessun blocker selezionato"}
          </h2>
        </div>
        {reviewItem ? <Badge variant={riskVariant(reviewItem.risk)}>{reviewItem.risk}</Badge> : null}
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <InfoRow label="Riferimento" value={source ? `${source.label}, p. ${source.page}` : "Fonte demo non trovata"} />
        <InfoRow label="Stato" value={reviewItem ? formatStatus(reviewItem.status) : "Nessuna azione"} />
        <InfoRow label="Impatto" value={reviewItem?.task ?? "Dashboard"} />
      </div>

      <blockquote className="mt-4 rounded-md border border-border bg-muted px-3 py-3 text-sm leading-6 text-muted-foreground">
        {source?.synthetic_excerpt ?? "Seleziona una priorità per vedere l’estratto sintetico collegato."}
      </blockquote>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Link
          className="rounded-md border border-border bg-background px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-muted"
          href={sectionHref(tenderId, "review")}
        >
          Apri validazione
        </Link>
        <Link
          className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href={sectionHref(tenderId, "documents")}
        >
          Apri fonte
        </Link>
      </div>
    </aside>
  );
}

function SectionBlock({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  href,
  icon: Icon,
  label,
  value,
  detail
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Link className="rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted" href={href}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <Icon aria-hidden="true" className="text-primary" size={18} />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </Link>
  );
}

function SimpleGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function SimpleItem({
  title,
  meta,
  badge,
  badgeVariant
}: {
  title: string;
  meta: string;
  badge: string;
  badgeVariant: BadgeVariant;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5">{title}</h3>
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{meta}</p>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function ReviewItemRow({ item, compact = false }: { item: TramReviewItem; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{item.title}</p>
        <Badge variant={riskVariant(item.risk)}>{item.risk}</Badge>
      </div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {formatStatus(item.status)} · {getSourceLabel(item.source_reference_id)}
      </p>
      {!compact ? null : (
        <p className="mt-2 text-xs text-muted-foreground">Azione richiesta prima di consolidare la dashboard.</p>
      )}
    </div>
  );
}

function AuditContent() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        In questa demo il registro attività resta minimale: creazione tender, blocchi policy e
        aggiornamenti futuri verranno visualizzati qui con attore, timestamp e motivo.
      </p>
    </div>
  );
}
