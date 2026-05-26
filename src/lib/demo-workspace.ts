import { copenhagenTenderId } from "./demo-workspace-constants";
import { readFile } from "node:fs/promises";
import {
  getTenderById,
  getTenderOverviewModel,
  getTramFixtures
} from "./fixtures";
import {
  buildDemoDocumentGroups,
  getDemoInventory,
  getDemoInventorySummary,
  getDemoTextExtract,
  getDemoTextExtractSummary,
  resolveDemoDocumentPath
} from "./demo-inventory";

export type DemoFixtureWorkspaceDataset = {
  kind: "fixture";
  model: ReturnType<typeof getTenderOverviewModel>;
  tenderId: string;
};

export type DemoInventoryDocumentGroup = ReturnType<typeof buildDemoDocumentGroups>[number];

export type DemoInventoryWorkspaceDataset = {
  groups: DemoInventoryDocumentGroup[];
  kind: "inventory";
  summary: Awaited<ReturnType<typeof getDemoInventorySummary>>;
  tenderId: string;
  textSummary: Awaited<ReturnType<typeof getDemoTextExtractSummary>>;
  title: string;
};

export type DemoWorkspaceDataset =
  | DemoFixtureWorkspaceDataset
  | DemoInventoryWorkspaceDataset;

export type DemoWorkspaceStoredDocument = {
  body: Uint8Array;
  contentType: string;
  fileName: string;
};

export type DemoWorkspaceSummary = {
  activeReviewCount: number;
  dashboardState: string;
  footerLabel: string;
  highPriorityCount: number;
  href: string;
  id: string;
  nextAction: string;
  packageLabel: string;
  privacyLabel: string;
  qnaCount: number;
  stageLabel: string;
  title: string;
};

function getActiveReviewCount(model: ReturnType<typeof getTenderOverviewModel>) {
  return model.reviewItems.filter((item) =>
    ["blocked", "needs_owner", "open", "contested"].includes(item.status)
  ).length;
}

function getHighPriorityReviewCount(model: ReturnType<typeof getTenderOverviewModel>) {
  return model.reviewItems.filter(
    (item) =>
      ["high", "critical"].includes(item.risk) &&
      ["blocked", "needs_owner", "open", "contested"].includes(item.status)
  ).length;
}

function getNextAction(model: ReturnType<typeof getTenderOverviewModel>) {
  const blockedReview = model.reviewItems.find((item) => item.status === "blocked");
  const highReview = model.reviewItems.find(
    (item) => item.risk === "critical" || item.risk === "high"
  );
  const dashboardQna = model.clarificationThreads.find(
    (thread) => thread.requires_dashboard_update || thread.status === "blocked"
  );

  if (blockedReview) {
    return blockedReview.title;
  }

  if (highReview) {
    return highReview.title;
  }

  if (dashboardQna) {
    return dashboardQna.title;
  }

  if (model.tender.dashboard_state === "validated_internal") {
    return "Pronta per lettura interna";
  }

  return "Aprire il quadro gara e completare i primi controlli";
}

function buildFixtureDemoSummary(
  model: ReturnType<typeof getTenderOverviewModel>
): DemoWorkspaceSummary {
  return {
    activeReviewCount: getActiveReviewCount(model),
    dashboardState: model.tender.dashboard_state,
    footerLabel: model.tender.transport_mode,
    highPriorityCount: getHighPriorityReviewCount(model),
    href: `/tenders/${model.tender.id}/overview`,
    id: model.tender.id,
    nextAction: getNextAction(model),
    packageLabel: model.tender.package_label,
    privacyLabel: model.tender.privacy_level,
    qnaCount: model.clarificationThreads.length,
    stageLabel: model.tender.stage,
    title: model.tender.name
  };
}

function buildCopenhagenDemoSummary(groups: DemoInventoryDocumentGroup[]): DemoWorkspaceSummary {
  const priorityGroups = groups.filter((group) => group.priority !== "normal");

  return {
    activeReviewCount: priorityGroups.length,
    dashboardState: "open_critical_issues",
    footerLabel: "metro",
    highPriorityCount: priorityGroups.length,
    href: `/tenders/${copenhagenTenderId}/overview`,
    id: copenhagenTenderId,
    nextAction:
      "Controllare documenti, scadenze e consegne con fonte sempre visibile.",
    packageLabel: "Pacchetto pubblico/rappresentativo Copenhagen M1/M4",
    privacyLabel: "L0",
    qnaCount: 0,
    stageLabel: "Gara",
    title: "Copenhagen M1/M4 O&M"
  };
}

export async function readDemoWorkspaceDataset(
  tenderId: string
): Promise<DemoWorkspaceDataset | null> {
  if (getTenderById(tenderId)) {
    return {
      kind: "fixture",
      model: getTenderOverviewModel(tenderId),
      tenderId
    };
  }

  if (tenderId !== copenhagenTenderId) {
    return null;
  }

  const [inventory, summary, textSummary] = await Promise.all([
    getDemoInventory(),
    getDemoInventorySummary(),
    getDemoTextExtractSummary()
  ]);

  return {
    groups: inventory ? buildDemoDocumentGroups(inventory) : [],
    kind: "inventory",
    summary,
    tenderId,
    textSummary,
    title: "Copenhagen M1/M4 O&M"
  };
}

export async function readDemoWorkspaceTextExtract({
  documentId,
  tenderId
}: {
  documentId: string;
  tenderId: string;
}) {
  if (tenderId !== copenhagenTenderId) {
    return null;
  }

  return getDemoTextExtract(documentId);
}

export async function readDemoWorkspaceStoredDocument({
  documentId,
  tenderId
}: {
  documentId: string;
  tenderId: string;
}): Promise<DemoWorkspaceStoredDocument | null> {
  if (tenderId !== copenhagenTenderId) {
    return null;
  }

  const inventory = await getDemoInventory();
  const file = inventory?.files.find((item) => item.id === documentId);

  if (!file) {
    return null;
  }

  const filePath = resolveDemoDocumentPath(file);

  if (!filePath) {
    return null;
  }

  try {
    return {
      body: new Uint8Array(await readFile(filePath)),
      contentType: file.contentType,
      fileName: file.fileName
    };
  } catch {
    return null;
  }
}

export async function listDemoWorkspaceSummaries() {
  const fixtureSummaries = getTramFixtures().tenders.map((tender) =>
    buildFixtureDemoSummary(getTenderOverviewModel(tender.id))
  );
  const copenhagenDataset = await readDemoWorkspaceDataset(copenhagenTenderId);

  if (copenhagenDataset?.kind !== "inventory") {
    return fixtureSummaries;
  }

  return [buildCopenhagenDemoSummary(copenhagenDataset.groups), ...fixtureSummaries];
}
