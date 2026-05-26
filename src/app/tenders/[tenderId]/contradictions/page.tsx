import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Criticità | TRAM",
  description: "Incoerenze, gap e conflitti da controllare prima di usarli."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function ContradictionsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="contradictions"
      title="Criticità"
      description="Incoerenze, gap e conflitti da verificare con le fonti prima di considerarli affidabili."
    />
  );
}
