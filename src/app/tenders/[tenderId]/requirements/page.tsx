import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function RequirementsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="requirements"
      title="Requisiti e KPI"
      description="Clausole O&M e indicatori non finanziari, sempre collegati a fonte e stato."
    />
  );
}
