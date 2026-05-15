"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { TramReviewItem, TramSourceReference } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

type ReviewQueueViewProps = {
  items: TramReviewItem[];
  sourceReferences: TramSourceReference[];
};

const riskLabels: Record<TramReviewItem["risk"], string> = {
  low: "Basso",
  medium: "Medio",
  high: "Alto",
  critical: "Critico"
};

const statusLabels: Record<string, string> = {
  blocked: "Bloccato",
  confirmed: "Confermato",
  contested: "Contestato",
  corrected: "Corretto",
  needs_owner: "Da assegnare",
  needs_review: "Da verificare",
  open: "Aperto",
  unclear: "Da chiarire"
};

const taskLabels: Record<string, string> = {
  T1: "Documenti",
  T2: "Timeline",
  T3: "Deliverables",
  T4: "Requisiti",
  T5: "Financials",
  T6: "Cost driver",
  T7: "Criticità",
  T8: "Q&A"
};

const actions = [
  { id: "confirmed", label: "Conferma" },
  { id: "corrected", label: "Correggi" },
  { id: "contested", label: "Contesta" },
  { id: "unclear", label: "Da chiarire" }
] as const;

function riskVariant(risk: TramReviewItem["risk"]) {
  return risk === "high" || risk === "critical" ? "risk" : "muted";
}

function statusVariant(status: string) {
  if (["blocked", "contested", "needs_owner", "needs_review", "open", "unclear"].includes(status)) {
    return "risk";
  }

  if (["confirmed", "corrected"].includes(status)) {
    return "success";
  }

  return "muted";
}

function formatStatus(status: string) {
  return statusLabels[status] ?? status;
}

function formatTask(task: string) {
  return taskLabels[task] ?? task;
}

export function ReviewQueueView({ items, sourceReferences }: ReviewQueueViewProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const [statusById, setStatusById] = useState<Record<string, string>>({});
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const selectedSource = sourceReferences.find(
    (source) => source.id === selectedItem?.source_reference_id
  );
  const activeItems = useMemo(
    () =>
      items.filter((item) =>
        ["blocked", "needs_owner", "open", "contested", "needs_review"].includes(
          statusById[item.id] ?? item.status
        )
      ).length,
    [items, statusById]
  );

  if (!selectedItem) {
    return (
      <section className="rounded-lg border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Nessun item da validare.</p>
      </section>
    );
  }

  const selectedStatus = statusById[selectedItem.id] ?? selectedItem.status;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Coda review</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeItems} item ancora aperti su {items.length}
              </p>
            </div>
            <Badge variant={activeItems > 0 ? "risk" : "success"}>
              {activeItems > 0 ? "Azione richiesta" : "Allineata"}
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => {
            const status = statusById[item.id] ?? item.status;

            return (
              <button
                key={item.id}
                className={cn(
                  "grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-muted md:grid-cols-[minmax(0,1fr)_auto]",
                  item.id === selectedItem.id ? "bg-muted" : ""
                )}
                type="button"
                onClick={() => setSelectedId(item.id)}
              >
                <span>
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {formatTask(item.task)} · {formatStatus(status)}
                  </span>
                </span>
                <span className="flex flex-wrap gap-2 md:justify-end">
                  <Badge variant={riskVariant(item.risk)}>{riskLabels[item.risk]}</Badge>
                  <Badge variant={statusVariant(status)}>{formatStatus(status)}</Badge>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="rounded-lg border border-border bg-card p-5 xl:sticky xl:top-6 xl:self-start">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">Fonte review</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{selectedItem.title}</h2>
          </div>
          <Badge variant={statusVariant(selectedStatus)}>{formatStatus(selectedStatus)}</Badge>
        </div>

        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Riferimento</dt>
            <dd className="mt-1 font-medium">
              {selectedSource ? `${selectedSource.label}, p. ${selectedSource.page}` : "Fonte non trovata"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ambito</dt>
            <dd className="mt-1 font-medium">{formatTask(selectedItem.task)}</dd>
          </div>
        </dl>

        <blockquote className="mt-4 rounded-md border border-border bg-muted px-3 py-3 text-sm leading-6 text-muted-foreground">
          {selectedSource?.synthetic_excerpt ?? "Nessun estratto collegato a questo item."}
        </blockquote>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {actions.map((action) => (
            <button
              key={action.id}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              type="button"
              onClick={() =>
                setStatusById((current) => ({ ...current, [selectedItem.id]: action.id }))
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
