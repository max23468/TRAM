import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Controlli | TRAM",
  description: "Coda prioritaria per confermare, correggere o contestare dati proposti."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function ReviewPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="review"
      title="Controlli"
      description="Coda prioritaria per confermare, correggere, contestare o lasciare da chiarire i dati proposti."
    />
  );
}
