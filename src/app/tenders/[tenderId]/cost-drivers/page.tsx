import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Cost driver | TRAM",
  description: "Famiglie costo e dipendenze operative proposte con fonti verificabili."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function CostDriversPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="cost-drivers"
      title="Cost driver"
      description="Famiglie costo e dipendenze operative proposte, senza importi inventati o assunzioni economiche libere."
    />
  );
}
