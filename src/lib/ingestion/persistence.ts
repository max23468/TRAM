import type { StorageDriver, StorageObjectMetadata } from "../storage";
import { assertSafeObjectKey } from "../storage";
import { toSafeSegment } from "./inventory";
import type { DocumentPackageInventory } from "./types";

export type PersistedInventoryRecord = {
  inventoryKey: string;
  metadata: StorageObjectMetadata;
};

export function buildInventoryStorageKey(inventory: Pick<DocumentPackageInventory, "packageId" | "tenderId">) {
  const key = `tenders/${toSafeSegment(inventory.tenderId)}/packages/${toSafeSegment(
    inventory.packageId
  )}/inventory.json`;

  assertSafeObjectKey(key);

  return key;
}

export async function persistDocumentPackageInventory({
  inventory,
  storage
}: {
  inventory: DocumentPackageInventory;
  storage: StorageDriver;
}): Promise<PersistedInventoryRecord> {
  const inventoryKey = buildInventoryStorageKey(inventory);
  const metadata = await storage.putObject({
    key: inventoryKey,
    body: JSON.stringify(inventory, null, 2),
    contentType: "application/json",
    metadata: {
      kind: "document_package_inventory",
      packageId: inventory.packageId,
      tenderId: inventory.tenderId
    }
  });

  return { inventoryKey, metadata };
}

export async function readDocumentPackageInventory({
  inventoryKey,
  storage
}: {
  inventoryKey: string;
  storage: StorageDriver;
}): Promise<DocumentPackageInventory> {
  assertSafeObjectKey(inventoryKey);

  const body = await storage.getObject(inventoryKey);
  return JSON.parse(new TextDecoder().decode(body)) as DocumentPackageInventory;
}
