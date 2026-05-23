import type { Metadata } from "next";
import { TenderSectionPage } from "@/features/navigation/tender-section-page";

export const metadata: Metadata = {
  title: "Deliverables | TRAM",
  description: "Submission, formati, limiti e stato validazione dei deliverables del Tender."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function DeliverablesPage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderSectionPage
      tenderId={tenderId}
      section="deliverables"
      title="Deliverables"
      description="Elenco submission, formati, limiti e stato validazione dei deliverables del Tender."
    />
  );
}
