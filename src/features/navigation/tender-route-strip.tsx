import Link from "next/link";
import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TramRouteNetwork } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

type RouteNode = TramRouteNetwork["nodes"][number];
type RouteEdge = TramRouteNetwork["edges"][number];
type BadgeVariant = "default" | "muted" | "risk" | "success";

const stateLabels: Record<string, string> = {
  answered: "Risposto",
  blocked: "Bloccato",
  candidate: "Candidato",
  confirmed: "Confermato",
  contested: "Contestato",
  draft: "Bozza",
  needs_owner: "Da assegnare",
  not_started: "Non avviato",
  not_applicable: "Non applicabile",
  open_critical_issues: "Criticità aperte",
  partially_validated: "Parziale",
  proposed: "Proposto",
  ready: "Pronto",
  stale: "Stale",
  stale_due_to_new_docs: "Stale",
  unclear: "Da chiarire",
  validated_internal: "Validato"
};

const edgeLabels: Record<string, string> = {
  addendum_stales_node: "Addendum",
  criticality_blocks_dashboard: "Criticità",
  financials_links_cost_driver: "Financials",
  qna_updates_timeline: "Q&A",
  review_updates_node: "Review",
  review_validates_node: "Review",
  source_to_review: "Fonte/review"
};

const nodeCodes: Record<string, string> = {
  documents: "DOC",
  timeline: "TIME",
  deliverables: "DEL",
  requirements: "REQ",
  q_and_a: "QA",
  financials: "FIN",
  cost_drivers: "COST",
  criticalities: "CRIT"
};

function formatState(state: string) {
  return stateLabels[state] ?? state;
}

function formatNodeCountLabel(node: RouteNode) {
  if (!node.count_label) {
    return formatState(node.state);
  }

  const labels: Partial<Record<RouteNode["node_key"], string>> = {
    timeline: node.count_label.replace("mismatch", "conflitto"),
    deliverables: node.count_label.replace("mapped", "mappati"),
    requirements: node.count_label.replace("payment", "pagamento"),
    q_and_a: node.count_label.replace("update", "aggiorn."),
    cost_drivers: node.count_label.replace("payment", "pagamento"),
    criticalities: node.count_label.replace("candidate", "criticità")
  };

  return labels[node.node_key] ?? node.count_label;
}

function edgeVariant(edge: RouteEdge): BadgeVariant {
  if (["contested", "stale", "stale_due_to_new_docs", "unclear"].includes(edge.state)) {
    return "risk";
  }

  if (edge.state === "confirmed") {
    return "success";
  }

  return "muted";
}

function nodeStyle(node: RouteNode) {
  return {
    "--route-token": `var(--${node.route_token})`
  } as CSSProperties;
}

function NodeIcon({ node }: { node: RouteNode }) {
  if (node.is_primary_blocker || node.risk === "critical" || node.risk === "high") {
    return <AlertTriangle aria-hidden="true" size={15} />;
  }

  if (["confirmed", "ready", "answered"].includes(node.state)) {
    return <CheckCircle2 aria-hidden="true" size={15} />;
  }

  if (node.ai_gate_status) {
    return <ShieldCheck aria-hidden="true" size={15} />;
  }

  return <CircleDot aria-hidden="true" size={15} />;
}

function RouteNodeItem({
  isLast,
  node
}: {
  isLast: boolean;
  node: RouteNode;
}) {
  return (
    <li className="relative flex min-w-0 flex-col items-center px-1" style={nodeStyle(node)}>
      {!isLast ? (
        <span className="absolute left-1/2 right-[-50%] top-[18px] h-px bg-border" aria-hidden="true" />
      ) : null}
      <Link
        aria-label={`${node.label}: ${formatState(node.state)}`}
        className={cn(
          "group relative z-10 flex w-full flex-col items-center gap-2 rounded-md px-2 py-1.5 text-center transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          node.is_primary_blocker ? "bg-muted ring-1 ring-[color:var(--route-token)]" : ""
        )}
        href={node.target_route}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[color:var(--route-token)] bg-card text-[color:var(--route-token)] shadow-sm ring-4 ring-background">
          <span className="font-mono text-[9px] font-bold leading-none">
            {nodeCodes[node.node_key] ?? <NodeIcon node={node} />}
          </span>
        </span>
        <span className="grid gap-1">
          <span className="text-xs font-semibold leading-4 text-foreground">{node.label}</span>
          <span className="font-mono text-[10px] leading-3 text-muted-foreground">
            {formatNodeCountLabel(node)}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function TenderRouteStrip({ network }: { network: TramRouteNetwork | undefined }) {
  if (!network) {
    return null;
  }

  const primaryEdges = network.edges.slice(0, 4);

  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-5" aria-labelledby="tender-route-strip-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">Percorso Tender</p>
          <h2 id="tender-route-strip-title" className="mt-1 text-sm font-semibold">
            Rete operativa del Tender
          </h2>
        </div>
        <Badge variant={network.primary_blocker_node_key ? "risk" : "success"}>
          {formatState(network.overall_state)}
        </Badge>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <ol className="grid min-w-[760px] grid-cols-8 items-start">
          {network.nodes.map((node, index) => (
            <RouteNodeItem key={node.id} isLast={index === network.nodes.length - 1} node={node} />
          ))}
        </ol>
      </div>

      {primaryEdges.length > 0 ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {primaryEdges.map((edge) => (
            <div key={edge.id} className="rounded-md border border-border bg-muted px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">
                  {edgeLabels[edge.relation_type] ?? edge.relation_type}
                </p>
                <Badge variant={edgeVariant(edge)}>{formatState(edge.state)}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-foreground">
                {edge.label ?? `${edge.from_node_key} -> ${edge.to_node_key}`}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
