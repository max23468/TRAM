export type StorageDriverName = "filesystem" | "oci";

export type StorageBody = string | Uint8Array;

export type StorageObjectMetadata = {
  key: string;
  size: number;
  contentType?: string;
  etag?: string;
  updatedAt?: string;
  metadata?: Record<string, string>;
};

export type PutObjectInput = {
  key: string;
  body: StorageBody;
  contentType?: string;
  metadata?: Record<string, string>;
};

export type StorageDriver = {
  name: StorageDriverName;
  putObject(input: PutObjectInput): Promise<StorageObjectMetadata>;
  getObject(key: string): Promise<Uint8Array>;
  headObject(key: string): Promise<StorageObjectMetadata>;
  deleteObject(key: string): Promise<void>;
  createTemporaryReadUrl(key: string, ttlSeconds: number): Promise<string>;
  listObjectsByTender(tenderId: string): Promise<StorageObjectMetadata[]>;
};

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export function assertSafeObjectKey(key: string) {
  if (!key || key.startsWith("/") || key.includes("..") || key.includes("\\")) {
    throw new StorageError(`Storage key non sicura: ${key}`, "unsafe_object_key");
  }
}

export function toUint8Array(body: StorageBody) {
  return typeof body === "string" ? new TextEncoder().encode(body) : body;
}
