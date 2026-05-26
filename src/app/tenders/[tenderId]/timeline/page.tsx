import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Scadenze | TRAM",
  description: "Scadenze, milestone, addendum e conflitti calendario della gara."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
};

export default async function TimelinePage({ params }: TenderRoutePageProps) {
  const { tenderId } = await params;

  return (
    <TenderWorkspaceRoutePage
      tenderId={tenderId}
      section="timeline"
      title="Scadenze"
      description="Scadenze, milestone, addendum e conflitti calendario da controllare con le fonti."
    />
  );
}
