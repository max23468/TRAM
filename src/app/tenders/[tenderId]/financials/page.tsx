import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Economia | TRAM",
  description: "Meccanismi economici, prezzi e penali con fonti e controllo umano."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function FinancialsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="financials"
      title="Economia"
      description="Meccanismi economici, prezzi e penali trattati come dati da controllare, con fonti e validazione umana."
    />
  );
}
