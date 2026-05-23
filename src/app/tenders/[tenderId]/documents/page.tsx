import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Document map | TRAM",
  description: "Inventario documenti, versioni e riferimenti fonte del Tender."
};

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
