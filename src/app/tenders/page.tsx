import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileQuestion,
  Layers3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TenderWorkspaceShell } from "@/features/navigation/tender-workspace-shell";
import {
  InspectorInfoRow,
  WorkspaceMetricCard,
  WorkspacePanel
} from "@/features/navigation/tender-workspace-primitives";
import {
  demoTendersHref,
  getDashboardStateLabel,
  getDashboardStateVariant,
  getPrivacyLabel,
  getPrivacyVariant,
  getStageLabel,
  getTransportLabel
} from "@/features/navigation/tender-workspace-config";
import { listDemoWorkspaceSummaries, type DemoWorkspaceSummary } from "@/lib/demo-workspace";
import { listLocalTenderSummaries } from "@/lib/local-workspace/server";
import type { LocalTenderSummary } from "@/lib/local-workspace/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gare | TRAM",
  description:
    "Elenco operativo delle gare con stato, priorità, documenti e prossimi controlli."
};

const filterOptions = [
  { id: "all", label: "Tutti" },
  { id: "attention", label: "Da seguire" },
  { id: "stale", label: "Da aggiornare" },
  { id: "validated", label: "Controllate" },
  { id: "draft", label: "Bozze" }
] as const;

type FilterId = (typeof filterOptions)[number]["id"];
function matchesDemoFilter(summary: DemoWorkspaceSummary, filter: FilterId) {
  if (filter === "all") {
    return true;
  }

  if (filter === "attention") {
    return ["open_critical_issues", "partially_validated"].includes(summary.dashboardState);
  }

  if (filter === "stale") {
    return summary.dashboardState === "stale_due_to_new_docs";
  }

  if (filter === "validated") {
    return summary.dashboardState === "validated_internal";
  }

  return summary.dashboardState === "draft";
}

function getFilterHref(filter: FilterId, isDemoMode: boolean) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("stato", filter);
  }

  if (isDemoMode) {
    params.set("vista", "demo");
  }

  const query = params.toString();

  return query ? `/tenders?${query}` : "/tenders";
}

function matchesLocalFilter(tender: LocalTenderSummary, filter: FilterId) {
  if (filter === "all") {
    return true;
  }

  if (filter === "attention") {
    return tender.openReviewCount > 0 || tender.documentCount === 0;
  }

  if (filter === "draft") {
    return tender.documentCount === 0;
  }

  return false;
}

type TendersPageProps = {
  searchParams?: Promise<{ stato?: string; vista?: string }>;
};

export default async function TendersPage({ searchParams }: TendersPageProps) {
  const params = await searchParams;
  const requestedFilter = params?.stato;
  const isDemoMode = params?.vista === "demo";
  const selectedFilter = filterOptions.some((option) => option.id === requestedFilter)
    ? (requestedFilter as FilterId)
    : "all";
  const localTenders = await listLocalTenderSummaries();
  const filteredLocalTenders = localTenders.filter((tender) =>
    matchesLocalFilter(tender, selectedFilter)
  );
  const demoSummaries = isDemoMode ? await listDemoWorkspaceSummaries() : [];
  const filteredDemoSummaries = demoSummaries.filter((summary) =>
    matchesDemoFilter(summary, selectedFilter)
  );
  const localAttentionCount = localTenders.filter((tender) =>
    matchesLocalFilter(tender, "attention")
  ).length;
  const localOpenReviewCount = localTenders.reduce(
    (total, tender) => total + tender.openReviewCount,
    0
  );
  const attentionCount =
    localAttentionCount +
    (isDemoMode
      ? demoSummaries.filter((summary) => matchesDemoFilter(summary, "attention")).length
      : 0);
  const blockersCount = demoSummaries.reduce(
    (total, summary) => total + summary.highPriorityCount,
    localOpenReviewCount
  );
  const qnaImpactCount = demoSummaries.reduce(
    (total, summary) => total + summary.qnaCount,
    0
  );
  const visibleTenderCount = filteredDemoSummaries.length + filteredLocalTenders.length;
  const documentCount = localTenders.reduce(
    (total, tender) => total + tender.documentCount,
    0
  );

  return (
    <TenderWorkspaceShell
      description={
        isDemoMode
          ? "Modalità dimostrativa: esempi sintetici e pacchetti pubblici servono per esplorare TRAM senza confonderli con il workspace reale."
          : "Workspace reale: qui compaiono solo le gare create localmente dall’utente, con documenti, inventario e controlli collegati."
      }
      headerBadges={
        <>
          <Badge variant="success">{isDemoMode ? "Modalità demo" : "Workspace reale"}</Badge>
          <Badge variant="muted">{visibleTenderCount} gare in vista</Badge>
        </>
      }
      productHref="/"
      sectionEyebrow="gare attive"
      sidebarBadges={
        <>
          <Badge variant="success">Operativo</Badge>
          <Badge variant="muted">Uso interno</Badge>
        </>
      }
      sidebarContent={
          <AggregateSidebar
            attentionCount={attentionCount}
            blockersCount={blockersCount}
            isDemoMode={isDemoMode}
            localTenderCount={localTenders.length}
            selectedFilter={selectedFilter}
            visibleTenderCount={visibleTenderCount}
          />
      }
      sidebarEyebrow="Area di lavoro"
      sidebarSubtitle="Gare, fonti e controlli"
      sidebarTitle="TRAM"
      statusLabel={isDemoMode ? "Dati dimostrativi" : "Workspace reale"}
      statusVariant="success"
      title="Gare"
      topActions={
        <>
          <Link className="text-sm font-medium text-primary hover:underline" href="/tenders/intake">
            Prepara gara
          </Link>
          <Link
            className="text-sm font-medium text-primary hover:underline"
            href={isDemoMode ? "/tenders" : demoTendersHref}
          >
            {isDemoMode ? "Workspace reale" : "Dati dimostrativi"}
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4" aria-label="Sintesi tender">
        <WorkspaceMetricCard icon={Layers3} label="Gare" value={String(visibleTenderCount)} />
        <WorkspaceMetricCard icon={AlertTriangle} label="Da seguire" value={String(attentionCount)} tone={attentionCount > 0 ? "risk" : "default"} />
        <WorkspaceMetricCard icon={ClipboardCheck} label="Controlli aperti" value={String(blockersCount)} tone={blockersCount > 0 ? "risk" : "default"} />
        <WorkspaceMetricCard
          icon={isDemoMode ? FileQuestion : Layers3}
          label={isDemoMode ? "Domande aperte" : "Documenti"}
          value={String(isDemoMode ? qnaImpactCount : documentCount)}
        />
      </section>

      <section className="grid gap-4">
        {visibleTenderCount === 0 ? <EmptyWorkspaceCard /> : null}
        {filteredLocalTenders.map((tender) => (
          <LocalTenderCard key={tender.id} tender={tender} />
        ))}
        {filteredDemoSummaries.map((summary) => (
          <OperationalTenderCard
            badges={
              <>
                <Badge variant={getDashboardStateVariant(summary.dashboardState)}>
                  {getDashboardStateLabel(summary.dashboardState)}
                </Badge>
                <Badge variant="muted">{getStageLabel(summary.stageLabel)}</Badge>
                <Badge variant={getPrivacyVariant(summary.privacyLabel)}>
                  {getPrivacyLabel(summary.privacyLabel)}
                </Badge>
              </>
            }
            ctaLabel="Apri quadro"
            footerLabel={getTransportLabel(summary.footerLabel)}
            href={summary.href}
            key={summary.id}
            metrics={[
              { label: "Controlli", value: String(summary.activeReviewCount) },
              { label: "Critici", value: String(summary.highPriorityCount) },
              { label: "Domande", value: String(summary.qnaCount) }
            ]}
            nextAction={summary.nextAction}
            packageLabel={summary.packageLabel}
            title={summary.title}
          />
        ))}
      </section>
    </TenderWorkspaceShell>
  );
}

function AggregateSidebar({
  attentionCount,
  blockersCount,
  isDemoMode,
  localTenderCount,
  selectedFilter,
  visibleTenderCount
}: {
  attentionCount: number;
  blockersCount: number;
  isDemoMode: boolean;
  localTenderCount: number;
  selectedFilter: FilterId;
  visibleTenderCount: number;
}) {
  return (
    <div className="grid gap-4 text-sm">
      <dl className="grid gap-3 rounded-md border border-[color:var(--sidebar-border)] bg-white/[0.04] p-3 text-[color:var(--sidebar-text)]">
        <InspectorInfoRow label="Vista" value={isDemoMode ? "Dati dimostrativi" : "Workspace reale"} />
        <InspectorInfoRow label="Filtro" value={filterOptions.find((option) => option.id === selectedFilter)?.label ?? "Tutti"} />
        <InspectorInfoRow label="Gare locali" value={localTenderCount} />
        <InspectorInfoRow label="Gare in vista" value={visibleTenderCount} />
        <InspectorInfoRow label="Da seguire" value={attentionCount} />
        <InspectorInfoRow label="Controlli aperti" value={blockersCount} />
      </dl>
      <Link
        className="rounded-md bg-white/[0.10] px-2 py-2 font-medium text-white transition-colors active:scale-95"
        href="/tenders/intake"
      >
        Prepara gara
      </Link>
      <Link
        className="rounded-md px-2 py-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
        href={isDemoMode ? "/tenders" : demoTendersHref}
      >
        {isDemoMode ? "Workspace reale" : "Dati dimostrativi"}
      </Link>
      <nav className="grid gap-1" aria-label="Filtri stato gare">
        {filterOptions.map((option) => (
          <Link
            key={option.id}
            className={cn(
              "rounded-md px-2 py-2 text-sm font-medium transition-colors active:scale-95",
              selectedFilter === option.id
                ? "bg-white/[0.10] text-white"
                : "text-[color:var(--sidebar-muted)] hover:bg-white/[0.06] hover:text-white"
            )}
            href={getFilterHref(option.id, isDemoMode)}
          >
            {option.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function EmptyWorkspaceCard() {
  return (
    <WorkspacePanel>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <p className="text-[11px] font-medium uppercase text-muted-foreground">
            Workspace reale
          </p>
          <h2 className="mt-1 text-lg font-semibold">Nessuna gara creata</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Crea una gara locale per caricare documenti, generare inventario e aprire le prime
            sezioni operative. I dati dimostrativi restano separati.
          </p>
        </div>
        <Link
          className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href="/tenders/intake"
        >
          Prepara gara
        </Link>
      </div>
    </WorkspacePanel>
  );
}

function LocalTenderCard({ tender }: { tender: LocalTenderSummary }) {
  return (
    <OperationalTenderCard
      badges={
        <>
          <Badge variant={tender.openReviewCount > 0 ? "risk" : "success"}>
            {tender.statusLabel}
          </Badge>
          <Badge variant="default">Gara locale</Badge>
          <Badge variant="muted">{tender.privacy}</Badge>
        </>
      }
      ctaLabel="Apri quadro"
      footerLabel={tender.stage}
      href={`/tenders/${tender.id}/overview`}
      metrics={[
        { label: "Documenti", value: String(tender.documentCount) },
        { label: "Controlli", value: String(tender.openReviewCount) },
        { label: "Owner", value: tender.owner || "-" }
      ]}
      nextAction={
        tender.openReviewCount > 0
          ? "Aprire i controlli generati dall’inventario locale."
          : "Aprire il quadro gara e verificare fonti e documenti."
      }
      packageLabel={tender.authority || "Workspace locale TRAM"}
      title={tender.name}
    />
  );
}

function OperationalTenderCard({
  badges,
  ctaLabel,
  footerLabel,
  href,
  metrics,
  nextAction,
  packageLabel,
  title
}: {
  badges: ReactNode;
  ctaLabel: string;
  footerLabel: string;
  href: string;
  metrics: Array<{ label: string; value: string }>;
  nextAction: string;
  packageLabel: string;
  title: string;
}) {
  return (
    <Link
      className="grid gap-5 rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:bg-muted active:scale-95 lg:grid-cols-[minmax(0,1fr)_280px]"
      href={href}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">{badges}</div>
        <p className="mt-4 text-lg font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{packageLabel}</p>
        <p className="mt-4 text-sm leading-6">
          <span className="font-medium">Prossima azione:</span> {nextAction}
        </p>
      </div>

      <div className="grid gap-3 text-sm">
        <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-muted p-3 text-center">
          {metrics.map((metric) => (
            <Metric key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 text-muted-foreground">
          <span>{footerLabel}</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            {ctaLabel}
            <ArrowRight aria-hidden="true" size={15} />
          </span>
        </div>
      </div>
    </Link>
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
