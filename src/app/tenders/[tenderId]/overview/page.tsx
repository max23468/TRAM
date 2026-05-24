import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Dashboard Tender | TRAM",
  description: "Quadro operativo evidence-first del Tender con stato, fonti e blocchi."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function OverviewPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="overview"
      title="Dashboard Tender"
      description="Quadro operativo evidence-first del Tender, con stato, fonti, blocchi e prossime decisioni."
    />
  );
}
