import { notFound } from "next/navigation";
import { readWorkspaceTenderViewModel } from "@/lib/workspace-view-model";
import { WorkspaceTenderSectionPage } from "./workspace-tender-section-page";

type TenderWorkspaceRoutePageProps = {
  description: string;
  section: string;
  sourceId?: string;
  tenderId: string;
  title: string;
};

export async function TenderWorkspaceRoutePage(props: TenderWorkspaceRoutePageProps) {
  const workspaceViewModel = await readWorkspaceTenderViewModel(props);

  if (!workspaceViewModel) {
    notFound();
  }

  return <WorkspaceTenderSectionPage model={workspaceViewModel} />;
}
