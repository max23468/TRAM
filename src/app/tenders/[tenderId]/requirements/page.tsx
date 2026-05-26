import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Requisiti e KPI | TRAM",
  description: "Clausole O&M e indicatori non finanziari collegati a fonte e stato."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function RequirementsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="requirements"
      title="Requisiti e KPI"
      description="Clausole O&M e indicatori non finanziari, sempre collegati a fonte e stato."
    />
  );
}
