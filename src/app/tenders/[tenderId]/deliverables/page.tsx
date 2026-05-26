import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Consegne | TRAM",
  description: "Documenti da preparare, formati, limiti e controlli collegati."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function DeliverablesPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="deliverables"
      title="Consegne"
      description="Elenco dei documenti da preparare, con formati, limiti, buste e stato dei controlli."
    />
  );
}
