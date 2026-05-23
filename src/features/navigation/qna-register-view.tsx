"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TramClarificationThread } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "risk" | "success";

type QnaRegisterViewProps = {
  threads: TramClarificationThread[];
};

const threadStatusLabels: Record<TramClarificationThread["status"], string> = {
  draft_question: "Bozza interna",
  sent_to_authority: "Registrato",
  answered: "Risposto",
  incorporated: "Incorporato",
  blocked: "Bloccato"
};

const clarificationKindLabels: Record<TramClarificationThread["clarification_kind"], string> = {
  clarification: "Precisazione",
  correction: "Correzione",
  answer: "Risposta",
  update: "Aggiornamento",
  unknown: "Da classificare"
};

const documentEffectLabels: Record<TramClarificationThread["currentness_effect"], string> = {
  none: "Nessuno",
  clarifies: "Precisa",
  corrects: "Corregge",
  supersedes: "Supera",
  adds_requirement: "Aggiunge requisito",
  removes_requirement: "Rimuove requisito",
  unknown: "Da valutare"
};

const filterOptions = [
  { id: "all", label: "Tutti" },
  { id: "open", label: "Aperti" },
  { id: "answered", label: "Risposti" },
  { id: "blocked", label: "Bloccati" },
  { id: "dashboard", label: "Impatto dashboard" }
] as const;

type FilterId = (typeof filterOptions)[number]["id"];

function threadVariant(status: TramClarificationThread["status"]): BadgeVariant {
  if (status === "blocked") {
    return "risk";
  }

  if (status === "incorporated") {
    return "success";
  }

  return "muted";
}

function getAction(thread: TramClarificationThread) {
  if (thread.blocked_reason) {
    return thread.blocked_reason;
  }

  if (thread.requires_dashboard_update) {
    return "Aggiornare dashboard";
  }

  if (thread.can_export) {
    return "Preparare export";
  }

  return "Tracciato";
}

function matchesFilter(thread: TramClarificationThread, filter: FilterId) {
  if (filter === "all") {
    return true;
  }

  if (filter === "open") {
    return thread.status === "draft_question" || thread.status === "sent_to_authority";
  }

  if (filter === "answered") {
    return thread.status === "answered" || thread.status === "incorporated";
  }

  if (filter === "blocked") {
    return thread.status === "blocked";
  }

  return thread.requires_dashboard_update;
}

function matchesSearch(thread: TramClarificationThread, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    thread.title,
    thread.source_register_row_no,
    thread.document_reference_raw,
    thread.question_summary,
    thread.answer_summary,
    getAction(thread)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function QnaRegisterView({ threads }: QnaRegisterViewProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const filteredThreads = useMemo(
    () => threads.filter((thread) => matchesFilter(thread, filter) && matchesSearch(thread, query)),
    [filter, query, threads]
  );

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Registro Q&A</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredThreads.length} di {threads.length} righe. Filtra le risposte che cambiano
              documenti, bloccano allegati o richiedono aggiornamento dashboard.
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={15}
            />
            <input
              aria-label="Cerca nel registro Q&A"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              placeholder="Cerca per riga, oggetto, documento"
              type="search"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                filter === option.id
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[640px] overflow-auto">
        <div className="sticky top-0 z-10 hidden grid-cols-[74px_1.4fr_120px_150px_120px_1fr] gap-3 border-b border-border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground lg:grid">
          <span>Riga</span>
          <span>Oggetto</span>
          <span>Stato</span>
          <span>Documento</span>
          <span>Effetto</span>
          <span>Azione</span>
        </div>

        {filteredThreads.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nessun Q&A corrisponde ai filtri.</p>
        ) : (
          <div className="divide-y divide-border">
            {filteredThreads.map((thread) => (
              <details key={thread.id} className="group">
                <summary className="grid cursor-pointer gap-2 px-4 py-3 text-sm transition-colors hover:bg-muted lg:grid-cols-[74px_1.4fr_120px_150px_120px_1fr] lg:items-center lg:gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {thread.source_register_row_no ? `Riga ${thread.source_register_row_no}` : "Bozza"}
                  </span>
                  <span className="font-medium">{thread.title}</span>
                  <span>
                    <Badge variant={threadVariant(thread.status)}>
                      {threadStatusLabels[thread.status]}
                    </Badge>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {thread.document_reference_raw ?? "Non indicato"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {documentEffectLabels[thread.currentness_effect]}
                  </span>
                  <span className="text-xs text-muted-foreground">{getAction(thread)}</span>
                </summary>

                <div className="grid gap-3 bg-muted/40 px-4 pb-4 pt-1 text-sm lg:grid-cols-[1fr_1fr_180px]">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Q</p>
                    <p className="mt-1 leading-6">{thread.question_summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">A</p>
                    <p className="mt-1 leading-6 text-muted-foreground">
                      {thread.answer_summary ?? "Risposta non presente."}
                    </p>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    <Badge variant="muted">{clarificationKindLabels[thread.clarification_kind]}</Badge>
                    <Badge variant="muted">
                      {thread.source_channel === "internal_draft" ? "Interno" : "Registro Q&A"}
                    </Badge>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
