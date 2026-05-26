import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Gauge,
  Layers3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { demoTendersHref } from "@/features/navigation/tender-workspace-config";
import type {
  WorkspaceActionLinkView,
  WorkspaceAuditItemView,
  WorkspaceDocumentGroupView,
  WorkspaceIconKey,
  WorkspacePriorityLinkView,
  WorkspaceReviewItemView,
  WorkspaceTenderViewModel
} from "@/lib/workspace-view-model";
import { DomainCandidateList } from "./domain-candidate-list";
import { LocalReviewActions } from "./local-review-actions";
import { TenderWorkspaceShell } from "./tender-workspace-shell";
import { tenderNavigationSections } from "./tender-workspace-config";
import {
  InspectorInfoRow,
  RouteStatusGrid,
  SourceInspectorPanel,
  WorkspaceKicker,
  WorkspaceMetricCard,
  WorkspacePanel
} from "./tender-workspace-primitives";

const iconMap: Record<WorkspaceIconKey, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  "calendar-days": CalendarDays,
  "check-circle": CheckCircle2,
  "clipboard-check": ClipboardCheck,
  "file-question": FileQuestion,
  "file-spreadsheet": FileSpreadsheet,
  "file-text": FileText,
  gauge: Gauge,
  layers: Layers3
};

export function WorkspaceTenderSectionPage({ model }: { model: WorkspaceTenderViewModel }) {
  const { shell } = model;

  return (
    <TenderWorkspaceShell
      currentSection={shell.currentSection}
      description={shell.description}
      headerBadges={shell.headerBadges.map((badge) => (
        <Badge key={`${badge.label}:${badge.variant}`} variant={badge.variant}>
          {badge.label}
        </Badge>
      ))}
      productLabel="TRAM"
      sectionEyebrow={shell.sectionEyebrow}
      sections={tenderNavigationSections}
      sidebarBadges={shell.sidebarBadges.map((badge) => (
        <Badge key={`${badge.label}:${badge.variant}`} variant={badge.variant}>
          {badge.label}
        </Badge>
      ))}
      sidebarContent={
        <dl className="grid gap-3 text-sm text-[color:var(--sidebar-text)]">
          {shell.sidebarRows.map((row) => (
            <InspectorInfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      }
      sidebarEyebrow="Gara"
      sidebarSubtitle={shell.sidebarSubtitle}
      sidebarTitle={shell.sidebarTitle}
      statusLabel={shell.statusLabel}
      statusVariant={shell.statusVariant}
      tenderId={shell.tenderId}
      title={shell.title}
      topActions={
        <Link
          className="text-sm font-medium text-primary hover:underline"
          href={model.mode === "demo-public" ? demoTendersHref : "/tenders"}
        >
          {model.mode === "demo-public" ? "Torna alla demo" : "Tutte le gare"}
        </Link>
      }
    >
      {shell.currentSection === "overview" ? <WorkspaceOverview model={model} /> : null}
      {shell.currentSection === "documents" ? <WorkspaceDocuments model={model} /> : null}
      {shell.currentSection === "review" ? <WorkspaceReview model={model} /> : null}
      {shell.currentSection === "audit" ? <WorkspaceAudit items={model.auditItems} /> : null}
      {!["overview", "documents", "review", "audit"].includes(shell.currentSection) ? (
        <WorkspaceDomainSection model={model} />
      ) : null}
    </TenderWorkspaceShell>
  );
}

function WorkspaceOverview({ model }: { model: WorkspaceTenderViewModel }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Metriche gara">
        {model.overview.metrics.map((metric) => (
          <WorkspaceMetricCard
            detail={metric.detail}
            href={metric.href}
            icon={iconMap[metric.icon]}
            key={`${metric.label}:${metric.value}`}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </section>

      <WorkspacePanel>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <WorkspaceKicker>Mappa gara</WorkspaceKicker>
            <h2 className="mt-1 text-lg font-semibold">Stato delle sezioni operative</h2>
          </div>
          <Badge variant="muted">{model.overview.routeItems.length} sezioni presidiate</Badge>
        </div>
        <RouteStatusGrid items={model.overview.routeItems} />
      </WorkspacePanel>

      {model.overview.priorityLinks.length > 0 ? (
        <section className="grid gap-3 lg:grid-cols-4" aria-label="Punti di ingresso">
          {model.overview.priorityLinks.map((link) => (
            <PriorityLink key={`${link.label}:${link.title}`} link={link} />
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <WorkspacePanel>
          <WorkspaceKicker>Prossime azioni</WorkspaceKicker>
          <h2 className="mt-1 text-lg font-semibold">Da fare ora</h2>
          <div className="mt-4 grid gap-3">
            {model.overview.primaryActions.map((action) => (
              <ActionLink action={action} key={`${action.title}:${action.href}`} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <WorkspaceKicker>{model.overview.detailsPanel.kicker}</WorkspaceKicker>
          <h2 className="mt-1 text-lg font-semibold">{model.overview.detailsPanel.title}</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {model.overview.detailsPanel.rows.map((row) => (
              <InspectorInfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </dl>
          {model.overview.detailsPanel.note ? (
            <p className="mt-4 rounded-md border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
              {model.overview.detailsPanel.note}
            </p>
          ) : null}
        </WorkspacePanel>
      </section>
    </>
  );
}

function WorkspaceDocuments({ model }: { model: WorkspaceTenderViewModel }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <WorkspacePanel id="document-map">
        <WorkspaceKicker>Documenti</WorkspaceKicker>
        <h2 className="mt-1 text-lg font-semibold">Mappa documentale</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          TRAM usa qui la stessa struttura per gare locali e dimostrative: fonte selezionabile,
          versioni, stato e accesso diretto al file corrente.
        </p>
        <div className="mt-5 divide-y divide-border rounded-md border border-border">
          {model.documentGroups.length === 0 ? (
            <p className="p-4 text-sm leading-6 text-muted-foreground">{model.documentEmptyMessage}</p>
          ) : (
            model.documentGroups.map((group) => <DocumentGroupRow group={group} key={group.id} />)
          )}
        </div>
      </WorkspacePanel>

      {model.selectedDocumentGroup ? (
        <DocumentInspector group={model.selectedDocumentGroup} />
      ) : null}
    </section>
  );
}

function WorkspaceReview({ model }: { model: WorkspaceTenderViewModel }) {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Controlli</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Elementi da verificare</h2>
      <div className="mt-5 grid gap-3">
        {model.reviewItems.length === 0 ? (
          <p className="rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
            {model.reviewEmptyMessage}
          </p>
        ) : null}
        {model.reviewItems.map((item) => (
          <ReviewRow item={item} key={item.id} />
        ))}
      </div>
    </WorkspacePanel>
  );
}

function WorkspaceAudit({ items }: { items: WorkspaceAuditItemView[] }) {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Registro</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Eventi workspace</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <article className="rounded-md border border-border bg-muted p-4" key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </div>
              <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
            </div>
          </article>
        ))}
      </div>
    </WorkspacePanel>
  );
}

function WorkspaceDomainSection({ model }: { model: WorkspaceTenderViewModel }) {
  if (!model.domainView) {
    return null;
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <WorkspacePanel>
        <WorkspaceKicker>{model.domainView.label}</WorkspaceKicker>
        <h2 className="mt-1 text-lg font-semibold">Fonti candidate da lavorare</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{model.domainView.intro}</p>

        {model.domainView.insights.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {model.domainView.insights.map((insight) => (
              <Link
                className="rounded-md border border-border bg-muted p-4 transition-colors hover:bg-card active:scale-95"
                href={insight.href}
                key={insight.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <Badge variant={insight.statusVariant}>{insight.statusLabel}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight.detail}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Fonte:</span> {insight.sourceLabel}
                </p>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-5">
          <DomainCandidateList
            candidates={model.domainView.candidates}
            emptyMessage={model.domainView.emptyMessage}
          />
        </div>
      </WorkspacePanel>

      <WorkspacePanel>
        <WorkspaceKicker>Stato sezione</WorkspaceKicker>
        <h2 className="mt-1 text-lg font-semibold">Pronta per lavoro guidato</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          {model.domainView.statusRows.map((row) => (
            <InspectorInfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      </WorkspacePanel>
    </section>
  );
}

function ActionLink({ action }: { action: WorkspaceActionLinkView }) {
  const Icon = iconMap[action.icon];

  return (
    <Link
      className="grid gap-3 rounded-md border border-border bg-muted p-4 transition-colors hover:bg-card active:scale-95 sm:grid-cols-[auto_minmax(0,1fr)]"
      href={action.href}
    >
      <span className="flex size-10 items-center justify-center rounded-md border border-primary/20 bg-secondary text-primary">
        <Icon aria-hidden="true" size={18} />
      </span>
      <span>
        <span className="block font-semibold">{action.title}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{action.detail}</span>
      </span>
    </Link>
  );
}

function PriorityLink({ link }: { link: WorkspacePriorityLinkView }) {
  const Icon = iconMap[link.icon];

  if (!link.href) {
    return (
      <div className="rounded-md border border-border bg-card p-4 opacity-70 shadow-[var(--shadow-card)]">
        <Icon aria-hidden="true" className="text-muted-foreground" size={18} />
        <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">{link.label}</p>
        <p className="mt-1 text-sm font-semibold">{link.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{link.detail}</p>
      </div>
    );
  }

  return (
    <Link
      className="rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40 hover:bg-muted active:scale-95"
      href={link.href}
    >
      <Icon aria-hidden="true" className="text-primary" size={18} />
      <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">{link.label}</p>
      <p className="mt-1 text-sm font-semibold">{link.title}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{link.detail}</p>
    </Link>
  );
}

function DocumentGroupRow({ group }: { group: WorkspaceDocumentGroupView }) {
  return (
    <Link
      className={[
        "grid gap-3 rounded-md border bg-card p-4 md:grid-cols-[minmax(0,1fr)_auto] transition-colors",
        group.selected
          ? "border-primary/40 bg-secondary"
          : "border-border hover:border-primary/30 hover:bg-muted"
      ].join(" ")}
      href={group.href}
    >
      <div>
        <div className="flex flex-wrap gap-2">
          {group.badges.map((badge) => (
            <Badge key={`${group.id}:${badge.label}`} variant={badge.variant}>
              {badge.label}
            </Badge>
          ))}
          {group.selected ? <Badge variant="success">Fonte aperta</Badge> : null}
        </div>
        <p className="mt-3 text-sm font-semibold">{group.heading}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.summary}</p>
      </div>
      <div className="grid content-start gap-2 text-sm md:justify-items-end">
        <Badge variant="muted">{group.versionCountLabel}</Badge>
        <p className="max-w-sm break-words text-muted-foreground md:text-right">
          {group.currentFileName}
        </p>
      </div>
    </Link>
  );
}

function DocumentInspector({ group }: { group: WorkspaceDocumentGroupView }) {
  return (
    <SourceInspectorPanel
      actions={
        <>
          {group.inspector.rawHref ? (
            <a
              className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              href={group.inspector.rawHref}
              rel="noreferrer"
              target="_blank"
            >
              {group.inspector.rawLabel ?? "Apri file"}
            </a>
          ) : null}
          {group.inspector.secondaryHref ? (
            <Link
              className="rounded-md border border-border bg-background px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-muted"
              href={group.inspector.secondaryHref}
            >
              {group.inspector.secondaryLabel ?? "Apri controlli"}
            </Link>
          ) : null}
        </>
      }
      badgeLabel={group.inspector.badge?.label}
      badgeVariant={group.inspector.badge?.variant}
      excerpt={group.inspector.excerpt}
      eyebrow={group.inspector.eyebrow}
      rows={group.inspector.rows}
      title={group.inspector.title}
    >
      {group.inspector.sourceText ? (
        <details className="mt-5 rounded-md border border-border bg-card">
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 p-3 text-sm font-semibold hover:bg-muted">
            {group.inspector.sourceText.label}
            <Badge variant={group.inspector.sourceText.text ? "success" : "muted"}>
              {group.inspector.sourceText.text ? "Testo disponibile" : "Non disponibile"}
            </Badge>
          </summary>
          <div className="border-t border-border p-3">
            {group.inspector.sourceText.text ? (
              <pre className="max-h-[260px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 text-xs leading-5">
                {group.inspector.sourceText.text}
              </pre>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                {group.inspector.sourceText.emptyMessage}
              </p>
            )}
          </div>
        </details>
      ) : null}
    </SourceInspectorPanel>
  );
}

function ReviewRow({ item }: { item: WorkspaceReviewItemView }) {
  return (
    <article className="rounded-md border border-border bg-muted p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.reason}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <Badge key={`${item.id}:${badge.label}`} variant={badge.variant}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      {item.sourceHref && item.sourceLabel ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Link className="font-medium text-primary hover:underline" href={item.sourceHref}>
            Apri fonte
          </Link>
          <Badge variant="muted">{item.sourceLabel}</Badge>
        </div>
      ) : null}

      {item.localAction ? (
        <LocalReviewActions
          reviewItemId={item.localAction.reviewItemId}
          status={item.localAction.status}
          tenderId={item.localAction.tenderId}
        />
      ) : null}
    </article>
  );
}
