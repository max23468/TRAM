import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Gauge,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  buildCphPilotDocumentGroups,
  formatBytes,
  getCphPilotInventory,
  getCphPilotSummary,
  getCphTextExtract,
  getCphTextExtractSummary,
  type CphPilotDocumentGroup,
  type CphPilotDocumentVersion
} from "@/lib/pilot-cph";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pilot Copenhagen M1/M4 | TRAM",
  description:
    "Vista pilot locale per document map e text extract sanificati della gara Copenhagen M1/M4 O&M."
};

type PageProps = {
  searchParams?: Promise<{ area?: string; group?: string }>;
};

function documentHref(file: CphPilotDocumentVersion) {
  return `/pilot/copenhagen-m1-m4-om/document?id=${encodeURIComponent(file.id)}`;
}

function pageHref(params: { area?: string; group?: string }) {
  const searchParams = new URLSearchParams();

  if (params.area) {
    searchParams.set("area", params.area);
  }

  if (params.group) {
    searchParams.set("group", params.group);
  }

  const query = searchParams.toString();

  return query ? `/pilot/copenhagen-m1-m4-om?${query}` : "/pilot/copenhagen-m1-m4-om";
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

  return normalized.length > 2800 ? `${normalized.slice(0, 2800)}\n[...]` : normalized;
}

function countByArea(groups: CphPilotDocumentGroup[]) {
  return groups.reduce<Record<string, { label: string; count: number }>>((accumulator, group) => {
    accumulator[group.areaId] = {
      label: group.areaLabel,
      count: (accumulator[group.areaId]?.count ?? 0) + 1
    };
    return accumulator;
  }, {});
}

function findGroup(groups: CphPilotDocumentGroup[], familyKey: string, documentCode?: string) {
  return groups.find(
    (group) =>
      group.familyKey === familyKey &&
      (!documentCode || group.documentCode === documentCode)
  );
}

export default async function CphPilotPage({ searchParams }: PageProps) {
  const [inventory, summary, textSummary, params] = await Promise.all([
    getCphPilotInventory(),
    getCphPilotSummary(),
    getCphTextExtractSummary(),
    searchParams
  ]);

  if (!inventory || !summary) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <TopNav />
        <section className="rounded-lg border border-border bg-card p-6">
          <Badge variant="risk">Inventario assente</Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Pilot CPH non inizializzato</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Genera prima l’inventario locale del pacchetto CPH.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs">
            npm run pilot:inventory -- data/packages/copenhagen-m1-m4-om copenhagen-m1-m4-om tender_cph_m1_m4_om CPH M1/M4 O&amp;M
          </pre>
        </section>
      </main>
    );
  }

  const groups = buildCphPilotDocumentGroups(inventory);
  const areaCounts = countByArea(groups);
  const areaOptions = Object.entries(areaCounts).sort((left, right) =>
    left[1].label.localeCompare(right[1].label)
  );
  const selectedArea = params?.area;
  const filteredGroups = selectedArea
    ? groups.filter((group) => group.areaId === selectedArea)
    : groups;
  const selectedGroup =
    filteredGroups.find((group) => group.id === params?.group) ??
    filteredGroups[0] ??
    groups[0];
  const visibleGroups = selectedArea ? filteredGroups : filteredGroups.slice(0, 12);
  const hiddenGroupCount = Math.max(filteredGroups.length - visibleGroups.length, 0);
  const selectedText = clipText(
    selectedGroup?.sourceTextVersion
      ? await getCphTextExtract(selectedGroup.sourceTextVersion.id)
      : null
  );
  const criticalGroups = groups.filter((group) => group.priority !== "normal");
  const scheduleGroup = findGroup(groups, "procurement_schedule");
  const instructionsGroup = findGroup(groups, "instructions", "CM-X-OMRT3-TD-0020");
  const pricesGroup = findGroup(groups, "schedule_prices");
  const contractGroup =
    findGroup(groups, "conditions_contract", "CM-X-OMRT3-TD-0011") ??
    findGroup(groups, "contract_specification", "CM-X-OMRT3-TD-0010");
  const routeItems = [
    {
      label: "Documenti",
      status: "Da validare",
      value: `${groups.length} famiglie`,
      href: "#document-map",
      variant: "success" as const
    },
    {
      label: "Timeline",
      status: scheduleGroup ? "Fonte trovata" : "Bloccata",
      value: scheduleGroup ? "Calendario PDF/MPP" : "Fonte calendario assente",
      href: scheduleGroup ? pageHref({ area: scheduleGroup.areaId, group: scheduleGroup.id }) : "#document-map",
      variant: scheduleGroup ? ("success" as const) : ("risk" as const)
    },
    {
      label: "Deliverables",
      status: "Da estrarre",
      value: "Formati, buste e obbligatorietà",
      href: instructionsGroup ? pageHref({ area: instructionsGroup.areaId, group: instructionsGroup.id }) : "#document-map",
      variant: "risk" as const
    },
    {
      label: "Requisiti",
      status: "Da estrarre",
      value: "Specifiche e allegati O&M",
      href: contractGroup ? pageHref({ area: contractGroup.areaId, group: contractGroup.id }) : "#document-map",
      variant: "risk" as const
    },
    {
      label: "Financials",
      status: pricesGroup ? "Human-first" : "Bloccato",
      value: pricesGroup ? "Workbook prezzi presente" : "Workbook assente",
      href: pricesGroup ? pageHref({ area: pricesGroup.areaId, group: pricesGroup.id }) : "#document-map",
      variant: "default" as const
    },
    {
      label: "Cost driver",
      status: "Da derivare",
      value: "Nessuna stima automatica",
      href: "#document-map",
      variant: "muted" as const
    },
    {
      label: "Criticità",
      status: "Candidate",
      value: "Redline e versioni da confrontare",
      href: "#document-map",
      variant: "risk" as const
    },
    {
      label: "Q&A",
      status: "Non importato",
      value: "Nessun invio automatico",
      href: "#document-map",
      variant: "muted" as const
    }
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <TopNav />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Dashboard Tender · pilot reale locale
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            CPH M1/M4 O&amp;M
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Quadro operativo evidence-first del Tender, allineato al modello TRAM: overview,
            stato, fonti P0, blocchi, route T1-T8 e drill-down verso documenti e sorgenti.
          </p>
        </div>

        <div className="rounded-lg border border-primary/25 bg-secondary p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">Decisione prioritaria</p>
          <p className="mt-2 text-sm font-semibold">Stabilizzare T1/T2/T3 sul pacchetto CPH.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Prima document map, poi timeline e deliverable con fonte e stato di review.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4" aria-label="Sintesi CPH">
        <SummaryCard icon={Gauge} label="Stato dashboard" value="Da validare" />
        <SummaryCard icon={AlertTriangle} label="Fonti P0 da verificare" value={String(criticalGroups.length)} />
        <SummaryCard
          icon={ClipboardCheck}
          label="Blocchi attivi"
          value={String(criticalGroups.length)}
        />
        <SummaryCard icon={FileQuestion} label="Q&A con impatto" value="0" />
      </section>

      <section className="rounded-lg border border-border bg-card p-4" aria-label="Route T1-T8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">Route T1-T8</p>
            <h2 className="mt-1 text-base font-semibold">Stato delle viste del modello</h2>
          </div>
          <Badge variant="muted">
            Testi PDF {textSummary?.extractedCount ?? 0}/{summary.extensionCounts[".pdf"] ?? 0}
          </Badge>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {routeItems.map((item) => (
            <Link
              key={item.label}
              className="rounded-md border border-border bg-muted p-3 transition-colors hover:bg-card active:scale-[0.99]"
              href={item.href}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{item.label}</p>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{item.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-4" aria-label="Drill-down prioritari">
        <PriorityLink
          group={scheduleGroup}
          icon={CalendarDays}
          label="Timeline"
          title="Date e versioni calendario"
        />
        <PriorityLink
          group={instructionsGroup}
          icon={FileText}
          label="Regole gara"
          title="Istruzioni ai concorrenti"
        />
        <PriorityLink
          group={pricesGroup}
          icon={FileSpreadsheet}
          label="Economics"
          title="Workbook prezzi"
        />
        <PriorityLink
          group={contractGroup}
          icon={CheckCircle2}
          label="Contratto"
          title="Obblighi e specifiche"
        />
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Filtri area documentale">
        <Link
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted active:scale-95",
            !selectedArea ? "border-primary bg-secondary text-secondary-foreground" : "border-border text-muted-foreground"
          )}
          href={pageHref({})}
        >
          Tutte ({groups.length})
        </Link>
        {areaOptions.map(([areaId, area]) => (
          <Link
            key={areaId}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted active:scale-95",
              selectedArea === areaId
                ? "border-primary bg-secondary text-secondary-foreground"
                : "border-border text-muted-foreground"
            )}
            href={pageHref({ area: areaId })}
          >
            {area.label} ({area.count})
          </Link>
        ))}
      </nav>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div id="document-map" className="scroll-mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-base font-semibold">Document map compatta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Non è un file browser: mostra prima i gruppi da cui dipendono timeline, regole,
              prezzi e contratto. Usa i filtri per scendere nelle aree.
            </p>
          </div>

          <div className="divide-y divide-border">
            {visibleGroups.map((group) => (
              <Link
                key={group.id}
                className={cn(
                  "grid gap-4 px-4 py-4 transition-colors hover:bg-muted active:scale-[0.995] lg:grid-cols-[minmax(0,1fr)_260px]",
                  group.id === selectedGroup?.id ? "bg-muted" : ""
                )}
                href={pageHref({ area: selectedArea, group: group.id })}
              >
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={group.priority} />
                    <Badge variant="muted">{group.areaLabel}</Badge>
                    {group.documentCode ? <Badge variant="muted">{group.documentCode}</Badge> : null}
                  </span>
                  <span className="mt-3 block text-sm font-semibold">{group.familyLabel}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {group.title}
                  </span>
                </span>

                <span className="grid content-start gap-2 text-sm">
                  <span className="flex flex-wrap gap-2 lg:justify-end">
                    <Badge variant="muted">{group.versions.length} versioni</Badge>
                    {group.formats.map((format) => (
                      <Badge key={format} variant="muted">
                        {format}
                      </Badge>
                    ))}
                    {group.hasTrackChanges ? <Badge variant="risk">Redline</Badge> : null}
                  </span>
                  <span className="text-muted-foreground lg:text-right">
                    Corrente: {group.currentVersion.fileName}
                  </span>
                </span>
              </Link>
            ))}
            {hiddenGroupCount > 0 ? (
              <div className="bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
                Altri {hiddenGroupCount} gruppi sono nascosti in questa vista iniziale. Seleziona
                un’area per vedere l’elenco completo senza trasformare la dashboard in un indice
                interminabile.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 xl:sticky xl:top-6 xl:self-start">
          {selectedGroup ? (
            <SourceInspector group={selectedGroup} selectedText={selectedText} />
          ) : (
            <p className="text-sm text-muted-foreground">Nessun documento disponibile.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function TopNav() {
  return (
    <nav className="flex items-center justify-between border-b border-border pb-4">
      <Link className="text-sm font-medium text-muted-foreground" href="/tenders">
        TRAM
      </Link>
      <Link className="text-sm font-medium text-primary hover:underline" href="/tenders">
        Torna ai Tender
      </Link>
    </nav>
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
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function PriorityLink({
  group,
  icon: Icon,
  label,
  title
}: {
  group: CphPilotDocumentGroup | undefined;
  icon: ComponentType<{ "aria-hidden": true; size: number; className?: string }>;
  label: string;
  title: string;
}) {
  if (!group) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 opacity-70">
        <Icon aria-hidden={true} className="text-muted-foreground" size={18} />
        <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">Fonte non trovata nell’inventario.</p>
      </div>
    );
  }

  return (
    <Link
      className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted active:scale-[0.99]"
      href={pageHref({ area: group.areaId, group: group.id })}
    >
      <div className="flex items-start justify-between gap-3">
        <Icon aria-hidden={true} className="text-primary" size={18} />
        <ArrowRight aria-hidden="true" className="text-muted-foreground" size={16} />
      </div>
      <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{title}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
        {group.currentVersion.fileName}
      </p>
    </Link>
  );
}

function PriorityBadge({ priority }: { priority: CphPilotDocumentGroup["priority"] }) {
  if (priority === "critical") {
    return <Badge variant="risk">Critico</Badge>;
  }

  if (priority === "high") {
    return <Badge variant="default">Alta priorità</Badge>;
  }

  return <Badge variant="muted">Normale</Badge>;
}

function SourceInspector({
  group,
  selectedText
}: {
  group: CphPilotDocumentGroup;
  selectedText: string | null;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">Fonte selezionata</p>
          <h2 className="mt-1 text-lg font-semibold leading-6">{group.familyLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.reviewFocus}</p>
        </div>
        <PriorityBadge priority={group.priority} />
      </div>

      <section className="mt-5 rounded-md border border-border bg-muted p-4">
        <p className="text-xs font-medium uppercase text-muted-foreground">Documento corrente</p>
        <p className="mt-2 break-words text-sm font-semibold">{group.currentVersion.fileName}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <InfoRow label="Area" value={group.areaLabel} />
          <InfoRow label="Versione" value={group.currentVersion.versionLabel} />
          <InfoRow label="Formato" value={group.currentVersion.formatLabel} />
          <InfoRow label="Dimensione" value={formatBytes(group.currentVersion.sizeBytes)} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
            href={documentHref(group.currentVersion)}
            rel="noreferrer"
            target="_blank"
          >
            Apri fonte corrente
            <ExternalLink aria-hidden="true" size={14} />
          </a>
          <a
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted active:scale-95"
            href={documentHref(group.currentVersion)}
            download={group.currentVersion.fileName}
          >
            Scarica copia locale
          </a>
        </div>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold">Versioni e varianti</h3>
        <div className="mt-3 divide-y divide-border rounded-md border border-border">
          {group.versions.map((version) => (
            <div key={version.id} className="grid gap-3 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={version.id === group.currentVersion.id ? "success" : "muted"}>
                  {version.id === group.currentVersion.id ? "Corrente" : version.versionLabel}
                </Badge>
                <Badge variant="muted">{version.formatLabel}</Badge>
                {version.isTrackChanges ? <Badge variant="risk">Redline</Badge> : null}
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="break-words text-muted-foreground">{version.fileName}</p>
                <a
                  className="shrink-0 text-primary hover:underline"
                  href={documentHref(version)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Apri
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="mt-5 rounded-md border border-border bg-card">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 p-3 text-sm font-semibold hover:bg-muted">
          Evidenza testuale PDF
          <Badge variant={selectedText ? "success" : "muted"}>
            {selectedText ? "Testo disponibile" : "Non disponibile"}
          </Badge>
        </summary>
        <div className="border-t border-border p-3">
          <p className="text-sm leading-6 text-muted-foreground">
            L’estratto serve solo per riconoscere la fonte. Date, requisiti e valori critici devono
            diventare item strutturati e revisionabili.
          </p>
          {selectedText ? (
            <pre className="mt-3 max-h-[300px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 text-xs leading-5">
              {selectedText}
            </pre>
          ) : (
            <p className="mt-3 rounded-md border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
              Nessun estratto testuale collegato a questa famiglia. Apri la fonte originale oppure
              rigenera gli estratti PDF locali.
            </p>
          )}
        </div>
      </details>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}
