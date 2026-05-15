import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function QueriesPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="queries"
      title="Q&A"
      description="Registri Q&A del Tender, bozze interne, risposte dell’ente, allegati mancanti ed effetti sullo stato documenti."
    />
  );
}
