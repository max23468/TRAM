import { TenderSectionPage } from "@/features/navigation/tender-section-page";

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function TimelinePage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="timeline"
      title="Timeline"
      description="Vista per scadenze, milestone, addendum e conflitti calendario da validare."
    />
  );
}
