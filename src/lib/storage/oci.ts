import { StorageDriver, StorageError, StorageObjectMetadata } from "./types";

export type OciAuthMode = "instance_principal" | "config_file";

export type OciStorageConfig = {
  region?: string;
  namespace?: string;
  bucketName?: string;
  compartmentId?: string;
  authMode: OciAuthMode;
};

export function readOciStorageConfig(
  env: NodeJS.ProcessEnv = process.env
): OciStorageConfig {
  return {
    region: env.TRAM_OCI_REGION,
    namespace: env.TRAM_OCI_NAMESPACE,
    bucketName: env.TRAM_OCI_BUCKET_DOCUMENTS,
    compartmentId: env.TRAM_OCI_COMPARTMENT_ID,
    authMode: (env.TRAM_OCI_AUTH_MODE as OciAuthMode | undefined) ?? "instance_principal"
  };
}

export function createOciObjectStorageDriver(
  config = readOciStorageConfig()
): StorageDriver {
  return new OciObjectStorageDriver(config);
}

class OciObjectStorageDriver implements StorageDriver {
  readonly name = "oci";

  constructor(private readonly config: OciStorageConfig) {}

  async putObject(): Promise<StorageObjectMetadata> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  async getObject(): Promise<Uint8Array> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  async headObject(): Promise<StorageObjectMetadata> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  async deleteObject(): Promise<void> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  async createTemporaryReadUrl(): Promise<string> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  async listObjectsByTender(): Promise<StorageObjectMetadata[]> {
    this.assertConfigured();
    throw this.notImplemented();
  }

  private assertConfigured() {
    const missing = [
      ["TRAM_OCI_REGION", this.config.region],
      ["TRAM_OCI_NAMESPACE", this.config.namespace],
      ["TRAM_OCI_BUCKET_DOCUMENTS", this.config.bucketName]
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);

    if (missing.length > 0) {
      throw new StorageError(
        `OCI Object Storage non configurato. Variabili mancanti: ${missing.join(", ")}`,
        "oci_not_configured"
      );
    }
  }

  private notImplemented() {
    return new StorageError(
      "Driver OCI predisposto ma non attivo: implementare SDK/IAM solo dopo bucket e runbook approvati.",
      "oci_driver_not_enabled"
    );
  }
}
