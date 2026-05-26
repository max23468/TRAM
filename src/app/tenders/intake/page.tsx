import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, FileCheck2, FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TenderIntakeForm } from "@/features/navigation/tender-intake-form";
import { TenderWorkspaceShell } from "@/features/navigation/tender-workspace-shell";
import { WorkspaceMetricCard } from "@/features/navigation/tender-workspace-primitives";
import { demoTendersHref } from "@/features/navigation/tender-workspace-config";

export const metadata: Metadata = {
  title: "Preparazione gara | TRAM",
  description: "Scheda operativa per impostare una nuova gara prima del controllo documentale."
};

export default function TenderIntakePage() {
  return (
    <TenderWorkspaceShell
      description="Imposta dati minimi, riferimento al pacchetto documentale e regole dati prima di avviare controlli, fonti e scadenze."
      headerBadges={
        <>
          <Badge variant="default">Nuova gara</Badge>
          <Badge variant="muted">Workspace locale</Badge>
        </>
      }
      productHref="/"
      sectionEyebrow="preparazione gara"
      sidebarBadges={
        <>
          <Badge variant="default">Bozza</Badge>
          <Badge variant="muted">Uso interno</Badge>
        </>
      }
      sidebarContent={<TenderIntakeSidebar />}
      sidebarEyebrow="Area di lavoro"
      sidebarSubtitle="Dati minimi, pacchetto e regole"
      sidebarTitle="Preparazione gara"
      statusLabel="In preparazione"
      title="Preparazione gara"
      topActions={
        <Link className="text-sm font-medium text-primary hover:underline" href="/tenders">
          Apri gare
        </Link>
      }
    >
      <section className="grid gap-4 md:grid-cols-4" aria-label="Passi di preparazione">
        <WorkspaceMetricCard icon={ClipboardList} label="Dati minimi" value="6 campi" />
        <WorkspaceMetricCard icon={FileText} label="Pacchetto" value="1 riferimento" />
        <WorkspaceMetricCard icon={ShieldCheck} label="Regole dati" value="Obbligatorie" />
        <WorkspaceMetricCard icon={FileCheck2} label="Primo controllo" value="3 check" />
      </section>

      <TenderIntakeForm />
    </TenderWorkspaceShell>
  );
}

function TenderIntakeSidebar() {
  return (
    <nav className="grid gap-1 text-sm" aria-label="Preparazione gara">
      <Link
        className="rounded-md bg-white/[0.10] px-2 py-2 font-medium text-white transition-colors active:scale-95"
        href="/tenders/intake"
      >
        Preparazione
      </Link>
      <Link
        className="rounded-md px-2 py-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
        href="/tenders"
      >
        Gare
      </Link>
      <Link
        className="rounded-md px-2 py-2 font-medium text-[color:var(--sidebar-muted)] transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
        href={demoTendersHref}
      >
        Dati dimostrativi
      </Link>
    </nav>
  );
}
