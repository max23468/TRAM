import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileQuestion,
  Layers3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getTenderClarificationThreads,
  getTenderOverviewModel,
  getTramFixtures,
  type TramTender
} from "@/lib/fixtures";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tender | TRAM",
  description:
    "Elenco operativo dei Tender demo con stato dashboard, review, documenti e policy AI."
};

const privacyLabels: Record<string, string> = {
  L0: "Pubblico",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

const dashboardStateLabels: Record<string, string> = {
  draft: "Bozza",
  open_critical_issues: "Criticità aperte",
  partially_validated: "Validazione parziale",
  stale_due_to_new_docs: "Stale per nuovi documenti",
  validated_internal: "Validato internamente"
};

const transportLabels: Record<string, string> = {
  bus: "Bus",
  bus_depot: "Deposito e-bus",
  light_rail: "Light rail",
  metro: "Metro"
};

const filterOptions = [
  { id: "all", label: "Tutti" },
  { id: "attention", label: "Da seguire" },
  { id: "stale", label: "Stale" },
  { id: "validated", label: "Validati" },
  { id: "draft", label: "Bozze" }
] as const;

type FilterId = (typeof filterOptions)[number]["id"];
type TenderModel = ReturnType<typeof getTenderOverviewModel>;

function getStateVariant(state: TramTender["dashboard_state"]) {
  if (state === "validated_internal") {
    return "success";
  }

  if (state === "open_critical_issues" || state === "stale_due_to_new_docs") {
    return "risk";
  }

  return "muted";
}

function matchesFilter(model: TenderModel, filter: FilterId) {
  if (filter === "all") {
    return true;
  }

  if (filter === "attention") {
    return ["open_critical_issues", "partially_validated"].includes(
      model.tender.dashboard_state
    );
  }

  if (filter === "stale") {
    return model.tender.dashboard_state === "stale_due_to_new_docs";
  }

  if (filter === "validated") {
    return model.tender.dashboard_state === "validated_internal";
  }

  return model.tender.dashboard_state === "draft";
}

function getActiveReviewCount(model: TenderModel) {
  return model.reviewItems.filter((item) =>
    ["blocked", "needs_owner", "open", "contested"].includes(item.status)
  ).length;
}

function getHighPriorityReviewCount(model: TenderModel) {
  return model.reviewItems.filter(
    (item) =>
      ["high", "critical"].includes(item.risk) &&
      ["blocked", "needs_owner", "open", "contested"].includes(item.status)
  ).length;
}

function getNextAction(model: TenderModel) {
  const blockedReview = model.reviewItems.find((item) => item.status === "blocked");
  const highReview = model.reviewItems.find(
    (item) => item.risk === "critical" || item.risk === "high"
  );
  const dashboardQna = model.clarificationThreads.find(
    (thread) => thread.requires_dashboard_update || thread.status === "blocked"
  );

  if (blockedReview) {
    return blockedReview.title;
  }

  if (highReview) {
    return highReview.title;
  }

  if (dashboardQna) {
    return dashboardQna.title;
  }

  if (model.tender.dashboard_state === "validated_internal") {
    return "Pronto per lettura interna";
  }

  return "Aprire overview e completare la prima review";
}

function getFilterHref(filter: FilterId) {
  return filter === "all" ? "/tenders" : `/tenders?stato=${filter}`;
}

type TendersPageProps = {
  searchParams?: Promise<{ stato?: string }>;
};

export default async function TendersPage({ searchParams }: TendersPageProps) {
  const fixtures = getTramFixtures();
  const params = await searchParams;
  const requestedFilter = params?.stato;
  const selectedFilter = filterOptions.some((option) => option.id === requestedFilter)
    ? (requestedFilter as FilterId)
    : "all";
  const models = fixtures.tenders.map((tender) => getTenderOverviewModel(tender.id));
  const filteredModels = models.filter((model) => matchesFilter(model, selectedFilter));
  const attentionCount = models.filter((model) => matchesFilter(model, "attention")).length;
  const blockersCount = models.reduce(
    (total, model) => total + getHighPriorityReviewCount(model),
    0
  );
  const qnaImpactCount = models.reduce(
    (total, model) => total + model.dashboardUpdateCount + model.blockedClarificationCount,
    0
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8">
      <nav className="flex items-center justify-between border-b border-border pb-4">
        <Link className="text-sm font-medium text-muted-foreground" href="/">
          TRAM
        </Link>
        <Badge variant="success">Demo sanificata</Badge>
      </nav>

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Dashboard aggregata
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Tender</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Vista di controllo sui Tender demo: stato, priorità, blocker, Q&A con impatto e accesso
          diretto alla dashboard gara.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4" aria-label="Sintesi tender">
        <SummaryCard icon={Layers3} label="Tender" value={String(models.length)} />
        <SummaryCard icon={AlertTriangle} label="Da seguire" value={String(attentionCount)} />
        <SummaryCard icon={ClipboardCheck} label="Blocker review" value={String(blockersCount)} />
        <SummaryCard icon={FileQuestion} label="Q&A con impatto" value={String(qnaImpactCount)} />
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Filtri stato tender">
        {filterOptions.map((option) => (
          <Link
            key={option.id}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              selectedFilter === option.id
                ? "border-primary bg-secondary text-secondary-foreground"
                : "border-border text-muted-foreground"
            )}
            href={getFilterHref(option.id)}
          >
            {option.label}
          </Link>
        ))}
      </nav>

      <section className="rounded-lg border border-primary/30 bg-secondary p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <Badge variant="success">Pilot reale</Badge>
            <h2 className="mt-3 text-lg font-semibold">CPH M1/M4 O&amp;M</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Apri document map, file originali e testo estratto dai documenti pubblici della
              procedura Copenhagen.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/pilot/copenhagen-m1-m4-om"
          >
            Apri pilot CPH
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {filteredModels.map((model) => (
          <Link
            key={model.tender.id}
            className="grid gap-5 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted lg:grid-cols-[minmax(0,1fr)_280px]"
            href={`/tenders/${model.tender.id}/overview`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getStateVariant(model.tender.dashboard_state)}>
                  {dashboardStateLabels[model.tender.dashboard_state] ??
                    model.tender.dashboard_state}
                </Badge>
                <Badge variant="muted">{model.tender.stage}</Badge>
                <Badge variant={model.tender.privacy_level === "L2" ? "risk" : "muted"}>
                  {privacyLabels[model.tender.privacy_level] ?? model.tender.privacy_level}
                </Badge>
              </div>
              <p className="mt-4 text-lg font-semibold">{model.tender.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{model.tender.package_label}</p>
              <p className="mt-4 text-sm leading-6">
                <span className="font-medium">Prossima azione:</span> {getNextAction(model)}
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-muted p-3 text-center">
                <Metric label="Review" value={String(getActiveReviewCount(model))} />
                <Metric label="Blocker" value={String(getHighPriorityReviewCount(model))} />
                <Metric
                  label="Q&A"
                  value={String(getTenderClarificationThreads(model.tender.id).length)}
                />
              </div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>{transportLabels[model.tender.transport_mode] ?? model.tender.transport_mode}</span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Apri overview
                  <ArrowRight aria-hidden="true" size={15} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ "aria-hidden": true; size: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <Icon aria-hidden={true} className="text-primary" size={18} />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="block text-base font-semibold text-foreground">{value}</span>
      <span className="mt-0.5 block text-[11px] uppercase text-muted-foreground">{label}</span>
    </span>
  );
}
