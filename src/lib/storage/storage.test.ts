import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createStorageDriver, StorageError } from ".";

describe("storage adapter TRAM", () => {
  it("salva, legge, lista e cancella oggetti sintetici su filesystem", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "tram-storage-"));
    const storage = createStorageDriver({ driver: "filesystem", localRoot: root });
    const key = "tenders/tender_fx_cop_metro_om/documents/doc_fx_itt/original.synthetic";

    try {
      const metadata = await storage.putObject({
        key,
        body: "contenuto sintetico",
        contentType: "text/plain",
        metadata: { fixture: "true" }
      });

      expect(metadata.key).toBe(key);
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata.contentType).toBe("text/plain");

      const body = await storage.getObject(key);
      expect(new TextDecoder().decode(body)).toBe("contenuto sintetico");

      const listed = await storage.listObjectsByTender("tender_fx_cop_metro_om");
      expect(listed.map((item) => item.key)).toContain(key);

      await storage.deleteObject(key);
      await expect(storage.listObjectsByTender("tender_fx_cop_metro_om")).resolves.toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rifiuta storage key non sicure", async () => {
    const storage = createStorageDriver({ driver: "filesystem" });

    await expect(
      storage.putObject({ key: "../data/packages/leak.pdf", body: "no" })
    ).rejects.toBeInstanceOf(StorageError);
  });

  it("mantiene OCI fail-closed finché mancano bucket e IAM", async () => {
    const storage = createStorageDriver({
      driver: "oci",
      env: { ...process.env, TRAM_STORAGE_DRIVER: "oci" }
    });

    await expect(storage.headObject("tenders/test/documents/test/original")).rejects.toMatchObject({
      code: "oci_not_configured"
    });
  });
});
