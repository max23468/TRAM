import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createStorageDriver } from "../storage";
import {
  buildDocumentPackageInventory,
  buildInventoryStorageKey,
  persistDocumentPackageInventory,
  readDocumentPackageInventory
} from ".";

async function createInventoryFixture() {
  const packageRoot = await mkdtemp(path.join(tmpdir(), "tram-ingestion-persist-package-"));

  await mkdir(path.join(packageRoot, "documents"), { recursive: true });
  await writeFile(path.join(packageRoot, "documents", "Instructions.pdf"), "%PDF-1.7 synthetic");

  return buildDocumentPackageInventory({
    tenderId: "tender_fx_cop_metro_om",
    packageId: "package_fx_001",
    packageLabel: "Pacchetto sintetico",
    rootPath: packageRoot,
    generatedAt: "2026-05-15T12:00:00.000Z"
  }).finally(() => rm(packageRoot, { recursive: true, force: true }));
}

describe("document package inventory persistence", () => {
  it("salva e rilegge inventario e parser issues nello storage locale escluso dal repo", async () => {
    const storageRoot = await mkdtemp(path.join(tmpdir(), "tram-storage-ingestion-"));
    const storage = createStorageDriver({ driver: "filesystem", localRoot: storageRoot });
    const inventory = await createInventoryFixture();

    try {
      const persisted = await persistDocumentPackageInventory({ inventory, storage });

      expect(persisted.inventoryKey).toBe(
        "tenders/tender_fx_cop_metro_om/packages/package_fx_001/inventory.json"
      );
      expect(persisted.metadata.contentType).toBe("application/json");
      expect(persisted.metadata.metadata).toEqual({
        kind: "document_package_inventory",
        packageId: "package_fx_001",
        tenderId: "tender_fx_cop_metro_om"
      });

      const restored = await readDocumentPackageInventory({
        inventoryKey: persisted.inventoryKey,
        storage
      });

      expect(restored).toEqual(inventory);
      expect(JSON.stringify(restored)).not.toContain("%PDF-1.7 synthetic");
    } finally {
      await rm(storageRoot, { recursive: true, force: true });
    }
  });

  it("costruisce solo storage key sicure per inventari", () => {
    expect(
      buildInventoryStorageKey({
        tenderId: "tender_fx_cop_metro_om",
        packageId: "package_fx_001"
      })
    ).toBe("tenders/tender_fx_cop_metro_om/packages/package_fx_001/inventory.json");

    expect(() =>
      buildInventoryStorageKey({
        tenderId: "../private",
        packageId: "package_fx_001"
      })
    ).toThrow("Storage key non sicura");

    expect(
      buildInventoryStorageKey({
        tenderId: "Tender COP Metro O&M",
        packageId: "Package 001 / Baseline"
      })
    ).toBe("tenders/tender-cop-metro-o-m/packages/package-001-baseline/inventory.json");
  });
});
