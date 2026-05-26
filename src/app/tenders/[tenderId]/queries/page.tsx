import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Domande/Risposte | TRAM",
  description: "Domande, risposte dell’ente e impatti su documenti e quadro gara."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function QueriesPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="queries"
      title="Domande/Risposte"
      description="Domande, risposte dell’ente, allegati mancanti ed effetti sullo stato dei documenti."
    />
  );
}
