import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function ContradictionsPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="contradictions"
      title="Criticità"
      description="Incoerenze, gap e conflitti candidati generati da regole, mai consolidati come verità automatica."
    />
  );
}
