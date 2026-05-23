import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Financials | TRAM",
  description: "Payment mechanism, pricing e dati economici con fonti e validazione umana."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function FinancialsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="financials"
      title="Financials"
      description="Payment mechanism, pricing e dati economici analizzabili come elementi del Tender, con fonti e validazione umana."
    />
  );
}
