import Link from "next/link";
import { ArrowRight, Database, FileJson, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getFixtureSummary, getTramFixtures } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

const setupCards = [
  {
    title: "Demo sanificata",
    description: "Dataset dimostrativo senza dati o path verso pacchetti reali.",
    icon: FileJson
  },
  {
    title: "Storage adapter",
    description: "Filesystem locale attivo; OCI predisposto e fail-closed.",
    icon: Database
  },
  {
    title: "Guardrail dati",
    description: ".gitignore, .env.example e blocco dati reali nella demo MVP.",
    icon: ShieldCheck
  }
];

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
  validated_internal: "Validato internamente",
  // Etichette legacy mantenute solo per eventuali fixture vecchie durante sviluppo locale.
  review_required: "Validazione richiesta",
  stale_documents: "Documenti da aggiornare",
  policy_blocked: "Policy bloccante",
  ready: "Pronto"
};

export default function Home() {
  const fixtures = getTramFixtures();
  const summary = getFixtureSummary();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-8">
      <nav className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-sm font-semibold">TRAM</p>
          <p className="text-xs text-muted-foreground">
            Tender Requirements Analysis & Monitoring
          </p>
        </div>
        <Badge variant="success">Demo MVP</Badge>
      </nav>

      <section className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
            Base applicativa pronta per roadmap MVP, demo sanificata e storage controllato.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Scaffold Next.js App Router con dati demo sanificati, nessun documento reale e
            separazione esplicita tra dominio, dataset applicativo e storage documentale.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className={cn(buttonVariants(), "w-fit")} href="/tenders">
              Apri tender
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
              href="/tenders/tender_fx_cop_metro_om/overview"
            >
              Apri demo
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Dataset demo
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">Tender</dt>
              <dd className="mt-1 text-2xl font-semibold">{summary.tendersCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Documenti</dt>
              <dd className="mt-1 text-2xl font-semibold">{summary.documentsCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Da validare</dt>
              <dd className="mt-1 text-2xl font-semibold">{summary.reviewItemsCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Q&A</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {summary.clarificationThreadsCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Policy AI</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {summary.aiGateDecisionsCount}
              </dd>
            </div>
          </dl>
          <p className="mt-5 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            Versione dati demo {summary.fixtureVersion}. Nessun riferimento a documenti reali.
          </p>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {setupCards.map((card) => (
          <article key={card.title} className="rounded-lg border border-border bg-card p-5">
            <card.icon className="text-primary" aria-hidden="true" size={20} />
            <h2 className="mt-4 text-base font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Tender demo</h2>
        </div>
        <div className="divide-y divide-border">
          {fixtures.tenders.map((tender) => (
            <Link
              key={tender.id}
              className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted md:grid-cols-[1fr_auto]"
              href={`/tenders/${tender.id}/overview`}
            >
              <div>
                <p className="font-medium">{tender.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tender.package_label}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{tender.stage}</Badge>
                <Badge variant={tender.privacy_level === "L2" ? "risk" : "muted"}>
                  {privacyLabels[tender.privacy_level] ?? tender.privacy_level}
                </Badge>
                <Badge variant="muted">
                  {dashboardStateLabels[tender.dashboard_state] ?? tender.dashboard_state}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
