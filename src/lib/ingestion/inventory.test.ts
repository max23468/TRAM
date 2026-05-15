import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildDocumentPackageInventory } from ".";

async function createSyntheticPackage() {
  const root = await mkdtemp(path.join(tmpdir(), "tram-ingestion-"));

  await mkdir(path.join(root, "a. tender documents"), { recursive: true });
  await mkdir(path.join(root, "b. pricing"), { recursive: true });
  await writeFile(path.join(root, "a. tender documents", "Instructions v2.pdf"), "%PDF-1.7 synthetic");
  await writeFile(path.join(root, "a. tender documents", "Schedule.mpp"), "synthetic mpp");
  await writeFile(path.join(root, "b. pricing", "Schedule of Prices.xlsx"), "synthetic xlsx");
  await writeFile(path.join(root, "empty.docx"), "");
  await writeFile(path.join(root, "unsupported.exe"), "nope");

  return root;
}

describe("document package ingestion inventory", () => {
  it("produce inventario con hash, metadati e storage key sicure senza leggere contenuti in output", async () => {
    const root = await createSyntheticPackage();

    try {
      const inventory = await buildDocumentPackageInventory({
        tenderId: "tender_fx_cop_metro_om",
        packageId: "package_fx_001",
        packageLabel: "Pacchetto sintetico",
        rootPath: root,
        rootLabel: "synthetic-package",
        generatedAt: "2026-05-15T12:00:00.000Z"
      });

      expect(inventory.fileCount).toBe(5);
      expect(inventory.totalSizeBytes).toBeGreaterThan(0);
      expect(inventory.rootLabel).toBe("synthetic-package");
      expect(inventory.generatedAt).toBe("2026-05-15T12:00:00.000Z");

      const pdf = inventory.files.find((file) => file.fileName === "Instructions v2.pdf");
      expect(pdf).toMatchObject({
        contentType: "application/pdf",
        extension: ".pdf",
        parserKind: "pdf",
        status: "needs_ocr_check"
      });
      expect(pdf?.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(pdf?.storageKey).toMatch(
        /^tenders\/tender_fx_cop_metro_om\/packages\/package_fx_001\/documents\/[a-f0-9]{16}-instructions-v2\.pdf$/
      );
      expect(pdf?.issues.map((issue) => issue.code)).toContain("parser_requires_ocr_check");

      const xlsx = inventory.files.find((file) => file.fileName === "Schedule of Prices.xlsx");
      expect(xlsx).toMatchObject({
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        parserKind: "spreadsheet",
        status: "ready_for_parser"
      });

      expect(JSON.stringify(inventory)).not.toContain("%PDF-1.7 synthetic");
      expect(JSON.stringify(inventory)).not.toContain("synthetic xlsx");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("segnala file vuoti e formati non supportati come parser issues applicative", async () => {
    const root = await createSyntheticPackage();

    try {
      const inventory = await buildDocumentPackageInventory({
        tenderId: "tender_fx_cop_metro_om",
        packageId: "package_fx_001",
        packageLabel: "Pacchetto sintetico",
        rootPath: root
      });

      const emptyDocx = inventory.files.find((file) => file.fileName === "empty.docx");
      const unsupported = inventory.files.find((file) => file.fileName === "unsupported.exe");

      expect(emptyDocx?.status).toBe("empty_file");
      expect(emptyDocx?.issues).toContainEqual({
        code: "empty_file",
        message: "File vuoto: il parser non può produrre fonti verificabili.",
        severity: "blocking"
      });

      expect(unsupported?.status).toBe("blocked");
      expect(unsupported?.parserKind).toBe("unknown");
      expect(unsupported?.issues.map((issue) => issue.code)).toContain("unsupported_extension");
      expect(inventory.issues).toContainEqual({
        code: "unsupported_extension",
        message: "2 file richiedono review prima del parsing.",
        severity: "warning"
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rifiuta input che non puntano a una directory di pacchetto", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "tram-ingestion-file-"));
    const filePath = path.join(root, "single.pdf");

    await writeFile(filePath, "synthetic");

    try {
      await expect(
        buildDocumentPackageInventory({
          tenderId: "tender_fx_cop_metro_om",
          packageId: "package_fx_001",
          packageLabel: "File singolo",
          rootPath: filePath
        })
      ).rejects.toThrow("La root del pacchetto documentale deve essere una directory.");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
