import type { Metadata } from "next";
import { TenderWorkspaceRoutePage } from "@/features/navigation/tender-workspace-route-page";

export const metadata: Metadata = {
  title: "Documenti | TRAM",
  description: "Inventario documenti, versioni e riferimenti fonte della gara."
};

type TenderRoutePageProps = {
  params: Promise<{ tenderId: string }>;
  searchParams: Promise<{ source?: string }>;
};

export default async function DocumentsPage({
  params,
  searchParams
}: TenderRoutePageProps) {
  const { tenderId } = await params;
  const { source } = await searchParams;

  return (
    <TenderWorkspaceRoutePage
      sourceId={source}
      tenderId={tenderId}
      section="documents"
      title="Documenti"
      description="Inventario documenti, famiglie, versioni, stato di aggiornamento e riferimenti fonte."
    />
  );
}
