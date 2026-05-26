import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Costi | TRAM",
  description: "Fattori operativi che possono incidere su costo, rischio o lavoro dell’offerta."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function CostDriversPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="cost-drivers"
      title="Costi"
      description="Fattori operativi che possono incidere su costo, rischio o lavoro dell’offerta, sempre collegati a una fonte."
    />
  );
}
