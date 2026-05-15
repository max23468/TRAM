import { TenderSectionPage } from "@/features/navigation/tender-section-page";

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
