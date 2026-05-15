import { TenderSectionPage } from "@/features/navigation/tender-section-page";

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
