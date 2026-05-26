import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, ClipboardCheck, FileText, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TenderWorkspaceShell } from "@/features/navigation/tender-workspace-shell";
import {
  InspectorInfoRow,
  WorkspaceMetricCard,
  WorkspacePanel
} from "@/features/navigation/tender-workspace-primitives";
import { demoTendersHref } from "@/features/navigation/tender-workspace-config";
import { listLocalTenderSummaries } from "@/lib/local-workspace/server";
import type { LocalTenderSummary } from "@/lib/local-workspace/types";

export const metadata: Metadata = {
  title: "TRAM",
  description: "Workspace operativo per controllare gare TPL, fonti e priorità."
};

export default async function Home() {
  const localTenders = await listLocalTenderSummaries();
  const openReviewCount = localTenders.reduce(
    (total, tender) => total + tender.openReviewCount,
    0
  );
  const documentCount = localTenders.reduce(
    (total, tender) => total + tender.documentCount,
    0
  );
  const tendersToShow = localTenders.slice(0, 3);

  return (
    <TenderWorkspaceShell
      description="Entra nel lavoro quotidiano: crea o apri una gara reale del workspace locale, controlla documenti, fonti e decisioni ancora aperte."
      headerBadgeItems={[
        { label: "Workspace reale", variant: "success" },
        { label: `${localTenders.length} gare locali`, variant: "muted" }
      ]}
      productHref="/"
      sectionEyebrow="workspace"
      sidebarBadgeItems={[
        { label: "Operativo", variant: "success" },
        { label: "Uso locale", variant: "muted" }
      ]}
      sidebarContent={
        <HomeSidebar localTenderCount={localTenders.length} openReviewCount={openReviewCount} />
      }
      sidebarEyebrow="Area di lavoro"
      sidebarSubtitle="Gare, fonti e controlli"
      sidebarTitle="TRAM"
      statusLabel="Workspace reale"
      statusVariant="success"
      title="Controllo gare"
      topActions={
        <>
          <Link className="text-sm font-medium text-primary hover:underline" href="/tenders/intake">
            Prepara gara
          </Link>
          <Link className="text-sm font-medium text-primary hover:underline" href="/tenders">
            Apri gare
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4" aria-label="Sintesi lavoro">
        <WorkspaceMetricCard icon={Layers3} label="Gare in lavoro" value={String(localTenders.length)} />
        <WorkspaceMetricCard
          icon={ClipboardCheck}
          label="Controlli aperti"
          tone={openReviewCount > 0 ? "risk" : "success"}
          value={String(openReviewCount)}
        />
        <WorkspaceMetricCard icon={FileText} label="Documenti" value={String(documentCount)} />
        <WorkspaceMetricCard
          icon={CalendarDays}
          label="Prossimo passo"
          value={localTenders.length > 0 ? "Apri gara" : "Crea gara"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <WorkspacePanel>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                Punto di partenza
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                {tendersToShow.length > 0 ? "Gare operative" : "Nessuna gara creata"}
              </h2>
            </div>
            <Link className="text-sm font-medium text-primary hover:underline" href="/tenders">
              Vedi workspace
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {tendersToShow.length > 0 ? (
              tendersToShow.map((tender) => <HomeTenderSummaryLink key={tender.id} tender={tender} />)
            ) : (
              <p className="rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
                Il workspace reale è vuoto. Crea una gara locale per iniziare a caricare documenti,
                generare inventario e aprire i primi controlli.
              </p>
            )}

            <HomeTenderLink
              badges={
                <>
                  <Badge variant="default">Nuova gara</Badge>
                  <Badge variant="muted">Workspace locale</Badge>
                </>
              }
              description="Imposta dati minimi, pacchetto documentale e regole dati."
              href="/tenders/intake"
              title="Prepara una nuova gara"
            />
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Demo separata</p>
          <h2 className="mt-1 text-lg font-semibold">Dati dimostrativi</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Esempi e gara Copenhagen restano disponibili per esplorare TRAM, ma non sono più
            mescolati al workspace operativo.
          </p>
          <Link
            className="mt-5 inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            href={demoTendersHref}
          >
            Apri modalità demo
          </Link>
        </WorkspacePanel>
      </section>
    </TenderWorkspaceShell>
  );
}

function HomeSidebar({
  localTenderCount,
  openReviewCount
}: {
  localTenderCount: number;
  openReviewCount: number;
}) {
  return (
    <div className="grid gap-4">
      <dl className="grid gap-3 text-sm text-[color:var(--sidebar-text)]">
        <InspectorInfoRow label="Vista" value="Workspace reale" />
        <InspectorInfoRow label="Gare locali" value={localTenderCount} />
        <InspectorInfoRow label="Controlli aperti" value={openReviewCount} />
      </dl>
      <nav className="grid gap-1 text-sm" aria-label="Ingresso TRAM">
        <Link
          className="rounded-md bg-white/[0.10] p-2 font-medium text-white transition-colors active:scale-95"
          href="/"
        >
          Home
        </Link>
        <Link
          className="rounded-md p-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
          href="/tenders"
        >
          Gare
        </Link>
        <Link
          className="rounded-md p-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
          href="/tenders/intake"
        >
          Prepara gara
        </Link>
        <Link
          className="rounded-md p-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
          href={demoTendersHref}
        >
          Dati dimostrativi
        </Link>
      </nav>
    </div>
  );
}

function HomeTenderSummaryLink({ tender }: { tender: LocalTenderSummary }) {
  return (
    <HomeTenderLink
      badges={
        <>
          <Badge variant={tender.openReviewCount > 0 ? "risk" : "success"}>
            {tender.statusLabel}
          </Badge>
          <Badge variant="muted">{tender.privacy}</Badge>
        </>
      }
      description={`${tender.documentCount} documenti · ${tender.openReviewCount} controlli aperti`}
      href={`/tenders/${tender.id}/overview`}
      title={tender.name}
    />
  );
}

function HomeTenderLink({
  badges,
  description,
  href,
  title
}: {
  badges: ReactNode;
  description: string;
  href: string;
  title: string;
}) {
  return (
    <Link
      className="grid gap-3 rounded-md border border-border bg-muted p-4 transition-colors hover:bg-card active:scale-95 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      href={href}
    >
      <span>
        <span className="flex flex-wrap gap-2">{badges}</span>
        <span className="mt-3 block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{description}</span>
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        Apri
        <ArrowRight aria-hidden="true" size={15} />
      </span>
    </Link>
  );
}
