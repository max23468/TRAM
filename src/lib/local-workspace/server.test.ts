import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const originalCwd = process.cwd();
let tempRoot: string | null = null;

async function importServerInTempWorkspace() {
  tempRoot = await mkdtemp(path.join(tmpdir(), "tram-local-workspace-"));
  process.chdir(tempRoot);
  vi.resetModules();
  return import("./server");
}

function createSyntheticUpload(name: string, body: string, type = "text/plain") {
  const bytes = new TextEncoder().encode(body);

  return {
    async arrayBuffer() {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    },
    name,
    size: bytes.byteLength,
    type
  };
}

describe("local tender workspace server", () => {
  afterEach(async () => {
    process.chdir(originalCwd);
    vi.resetModules();

    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true });
      tempRoot = null;
    }
  });

  it("aggiorna solo review item esistenti", async () => {
    const {
      createLocalTenderWorkspace,
      readLocalTenderWorkspace,
      updateLocalReviewItemStatus
    } = await importServerInTempWorkspace();
    const workspace = await createLocalTenderWorkspace({
      authority: "Autorità sintetica",
      city: "Città sintetica",
      files: [createSyntheticUpload("documento.pdf", "%PDF-1.7 synthetic", "application/pdf")],
      name: "Gara sintetica",
      notes: "",
      owner: "Team offerta",
      packageReference: "",
      privacy: "Uso interno",
      stage: "Gara"
    });
    const reviewItemId = workspace.reviewItems[0]?.id;

    expect(reviewItemId).toBeTruthy();

    const missingResult = await updateLocalReviewItemStatus({
      reviewItemId: "rev_missing",
      status: "Chiuso",
      tenderId: workspace.tender.id
    });

    expect(missingResult.status).toBe("review_item_not_found");

    const unchangedWorkspace = await readLocalTenderWorkspace(workspace.tender.id);
    expect(unchangedWorkspace?.reviewItems[0]?.status).toBe("Aperto");
    expect(unchangedWorkspace?.auditEvents).toHaveLength(1);

    const updatedResult = await updateLocalReviewItemStatus({
      reviewItemId: reviewItemId!,
      status: "Chiuso",
      tenderId: workspace.tender.id
    });

    expect(updatedResult.status).toBe("updated");

    const updatedWorkspace = await readLocalTenderWorkspace(workspace.tender.id);
    expect(updatedWorkspace?.reviewItems[0]?.status).toBe("Chiuso");
    expect(updatedWorkspace?.auditEvents[0]?.label).toBe("Controllo aggiornato: Chiuso.");
  });
});
