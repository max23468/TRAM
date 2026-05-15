import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTenderClarificationThreads, getTramFixtures } from "@/lib/fixtures";

const privacyLabels: Record<string, string> = {
  L0: "Pubblico",
  L1: "Uso interno",
  L2: "Accesso ristretto"
};

export default function TendersPage() {
  const fixtures = getTramFixtures();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8">
      <nav className="flex items-center justify-between border-b border-border pb-4">
        <Link className="text-sm font-medium text-muted-foreground" href="/">
          TRAM
        </Link>
        <Badge variant="success">Demo sanificata</Badge>
      </nav>

      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Tender</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Primo elenco applicativo basato su dataset demo sanificati. I tender non
          contengono documentazione reale.
        </p>
      </section>

      <section className="grid gap-4">
        {fixtures.tenders.map((tender) => (
          <Link
            key={tender.id}
            className="grid gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted md:grid-cols-[1fr_auto]"
            href={`/tenders/${tender.id}/overview`}
          >
            <div>
              <p className="text-lg font-semibold">{tender.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tender.package_label}</p>
            </div>
            <div className="flex flex-wrap items-start gap-2 md:justify-end">
              <Badge>{tender.stage}</Badge>
              <Badge variant={tender.privacy_level === "L2" ? "risk" : "muted"}>
                {privacyLabels[tender.privacy_level] ?? tender.privacy_level}
              </Badge>
              <Badge variant="muted">{tender.transport_mode}</Badge>
              {getTenderClarificationThreads(tender.id).length > 0 ? (
                <Badge variant="risk">
                  {getTenderClarificationThreads(tender.id).length} Q&A
                </Badge>
              ) : null}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
