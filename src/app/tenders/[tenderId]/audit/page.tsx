import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Registro | TRAM",
  description: "Controlli, regole dati e tracciabilità operativa della gara."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function AuditPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="audit"
      title="Registro"
      description="Controlli eseguiti, regole dati e tracciabilità operativa senza contenuti riservati nei log."
    />
  );
}
