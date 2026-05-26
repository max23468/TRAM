import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { WorkspaceDomainCandidate } from "@/lib/workspace-domain";

export function DomainCandidateList({
  candidates,
  emptyMessage
}: {
  candidates: WorkspaceDomainCandidate[];
  emptyMessage: string;
}) {
  if (candidates.length === 0) {
    return (
      <p className="rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {candidates.map((candidate) => (
        <article className="rounded-md border border-border bg-muted p-4" key={candidate.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words font-semibold">{candidate.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{candidate.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={candidate.priorityVariant}>{candidate.priorityLabel}</Badge>
              <Badge variant={candidate.statusVariant}>{candidate.statusLabel}</Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {candidate.tags.map((tag) => (
              <Badge key={`${candidate.id}:${tag}`} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Fonte:</span> {candidate.sourceLabel}
            </p>
            <Link className="text-sm font-medium text-primary hover:underline" href={candidate.sourceHref}>
              Apri fonte
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
