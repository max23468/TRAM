import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function DocumentsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="documents"
      title="Document map"
      description="Inventario documenti, famiglie, versioni, stato aggiornamento e riferimenti fonte sintetici."
    />
  );
}
