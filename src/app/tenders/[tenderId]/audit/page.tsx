import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Registro attività | TRAM",
  description: "Eventi, gate AI, policy dati e tracciabilità operativa del Tender."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function AuditPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="audit"
      title="Registro attività"
      description="Eventi, gate AI, policy dati e tracciabilità operativa senza contenuti riservati nei log."
    />
  );
}
