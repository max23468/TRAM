import { createFilesystemStorageDriver } from "./filesystem";
import { createOciObjectStorageDriver, readOciStorageConfig } from "./oci";
import { StorageDriver, StorageDriverName, StorageError } from "./types";

export type StorageFactoryOptions = {
  driver?: StorageDriverName;
  localRoot?: string;
  env?: NodeJS.ProcessEnv;
};

export function createStorageDriver(options: StorageFactoryOptions = {}): StorageDriver {
  const driver = options.driver ?? (options.env?.TRAM_STORAGE_DRIVER as StorageDriverName) ?? "filesystem";

  if (driver === "filesystem") {
    return createFilesystemStorageDriver(
      options.localRoot ?? options.env?.TRAM_LOCAL_STORAGE_ROOT ?? ".local/tram-storage"
    );
  }

  if (driver === "oci") {
    return createOciObjectStorageDriver(readOciStorageConfig(options.env));
  }

  throw new StorageError(`Storage driver non supportato: ${driver}`, "unsupported_driver");
}

export * from "./filesystem";
export * from "./oci";
export * from "./types";
