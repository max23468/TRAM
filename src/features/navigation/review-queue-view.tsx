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
  {
    id: "confirmed",
    label: "Conferma",
    description: "Il dato è corretto e può essere usato in dashboard.",
    className: "border-green-700 bg-green-700 text-white hover:bg-green-800"
  },
  {
    id: "corrected",
    label: "Correggi",
    description: "Il dato è utile, ma va modificato prima di usarlo.",
    className: "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
  },
  {
    id: "contested",
    label: "Contesta",
    description: "Il dato sembra errato, debole o non supportato dalla fonte.",
    className: "border-red-700 bg-red-700 text-white hover:bg-red-800"
  },
  {
    id: "unclear",
    label: "Da chiarire",
    description: "Serve una verifica esterna o una domanda prima di decidere.",
    className: "border-border bg-background text-foreground hover:bg-muted"
  }
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

function priorityWeight(item: TramReviewItem, status: string) {
  if (status === "blocked") {
    return 0;
  }

  if (item.risk === "critical") {
    return 1;
  }

  if (item.risk === "high") {
    return 2;
  }

  if (["needs_owner", "open", "needs_review", "contested", "unclear"].includes(status)) {
    return 3;
  }

  return 4;
}

function priorityLabel(item: TramReviewItem, status: string) {
  if (status === "blocked") {
    return "Prima cosa da risolvere";
  }

  if (item.risk === "critical" || item.risk === "high") {
    return "Alta priorità";
  }

  if (["confirmed", "corrected"].includes(status)) {
    return "Già trattato";
  }

  return "Da decidere";
}

function reasonForItem(item: TramReviewItem, status: string) {
  if (status === "blocked") {
    return "Blocca l’uso del dato finché non viene verificato.";
  }

  if (item.task === "T2") {
    return "Riguarda una scadenza o un evento di calendario.";
  }

  if (item.task === "T5") {
    return "Riguarda un dato economico: non va consolidato senza controllo.";
  }

  if (item.task === "T8") {
    return "Riguarda Q&A o chiarimenti: serve decisione umana prima di aggiornare la dashboard.";
  }

  return "Il dato è proposto e richiede una decisione umana prima di essere considerato affidabile.";
}

function recommendedAction(item: TramReviewItem, status: string) {
  if (status === "blocked") {
    return "Apri la fonte e decidi se contestare o chiedere chiarimenti.";
  }

  if (item.task === "T2" || item.task === "T8") {
    return "Controlla fonte e impatto; se la fonte è coerente, correggi o conferma.";
  }

  if (item.risk === "high" || item.risk === "critical") {
    return "Non confermare senza verifica della fonte.";
  }

  return "Leggi la fonte, poi scegli l’azione più adatta.";
}

export function ReviewQueueView({ items, sourceReferences }: ReviewQueueViewProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const [statusById, setStatusById] = useState<Record<string, string>>({});
  const sortedItems = useMemo(
    () =>
      items.toSorted((left, right) => {
        const leftStatus = statusById[left.id] ?? left.status;
        const rightStatus = statusById[right.id] ?? right.status;
        return priorityWeight(left, leftStatus) - priorityWeight(right, rightStatus);
      }),
    [items, statusById]
  );
  const selectedItem = sortedItems.find((item) => item.id === selectedId) ?? sortedItems[0];
  const selectedSource = sourceReferences.find(
    (source) => source.id === selectedItem?.source_reference_id
  );
  const activeItems = useMemo(
    () =>
      items.filter((item) =>
        ["blocked", "needs_owner", "open", "contested", "needs_review", "unclear"].includes(
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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h2 className="text-base font-semibold">Elementi da validare</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Qui decidi se un dato proposto può essere usato, va corretto, va contestato o
                richiede un chiarimento. Parti dagli item bloccanti e ad alta priorità.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Badge variant={activeItems > 0 ? "risk" : "success"}>
                {activeItems > 0 ? `${activeItems} da decidere` : "Allineata"}
              </Badge>
              <Badge variant="muted">{items.length} totali</Badge>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedItems.map((item) => {
            const status = statusById[item.id] ?? item.status;
            const selected = item.id === selectedItem.id;

            return (
              <button
                key={item.id}
                className={cn(
                  "grid w-full gap-3 border-l-4 px-4 py-4 text-left transition-colors hover:bg-muted md:grid-cols-[minmax(0,1fr)_auto]",
                  selected ? "border-l-primary bg-muted" : "border-l-transparent",
                  priorityWeight(item, status) <= 2 && !selected ? "border-l-red-700/60" : ""
                )}
                type="button"
                onClick={() => setSelectedId(item.id)}
              >
                <span>
                  <span className="mb-2 inline-flex rounded-sm bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {priorityLabel(item, status)}
                  </span>
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
            <p className="font-mono text-xs uppercase text-muted-foreground">Decisione richiesta</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{selectedItem.title}</h2>
          </div>
          <Badge variant={statusVariant(selectedStatus)}>{formatStatus(selectedStatus)}</Badge>
        </div>

        <div className="mt-4 grid gap-3 rounded-md border border-border bg-muted p-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Perché è qui</p>
            <p className="mt-1 leading-6">{reasonForItem(selectedItem, selectedStatus)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Azione consigliata</p>
            <p className="mt-1 leading-6">{recommendedAction(selectedItem, selectedStatus)}</p>
          </div>
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

        <blockquote className="mt-4 rounded-md border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
          {selectedSource?.synthetic_excerpt ?? "Nessun estratto collegato a questo item."}
        </blockquote>

        <div className="mt-4 grid gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              className={cn(
                "rounded-md border p-3 text-left text-sm font-medium transition-colors",
                action.className
              )}
              type="button"
              onClick={() =>
                setStatusById((current) => ({ ...current, [selectedItem.id]: action.id }))
              }
            >
              <span className="block">{action.label}</span>
              <span className="mt-1 block text-xs font-normal opacity-85">
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
