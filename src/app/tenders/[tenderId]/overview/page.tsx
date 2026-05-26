import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Quadro gara | TRAM",
  description: "Stato operativo della gara con fonti, priorità e prossime decisioni."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function OverviewPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="overview"
      title="Quadro gara"
      description="Stato operativo della gara: priorità, fonti, scadenze, controlli aperti e prossime decisioni."
    />
  );
}
