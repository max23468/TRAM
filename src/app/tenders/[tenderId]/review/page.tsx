import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function ReviewPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="review"
      title="Da validare"
      description="Coda prioritaria per validare, correggere, contestare o bloccare dati proposti."
    />
  );
}
