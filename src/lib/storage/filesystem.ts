import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertSafeObjectKey,
  PutObjectInput,
  StorageDriver,
  StorageError,
  StorageObjectMetadata,
  toUint8Array
} from "./types";

type MetadataSidecar = Pick<
  StorageObjectMetadata,
  "contentType" | "etag" | "metadata"
>;

export function createFilesystemStorageDriver(root = ".local/tram-storage"): StorageDriver {
  const rootPath = path.resolve(process.cwd(), root);

  function resolveKey(key: string) {
    assertSafeObjectKey(key);

    const objectPath = path.resolve(rootPath, key);
    if (objectPath !== rootPath && !objectPath.startsWith(`${rootPath}${path.sep}`)) {
      throw new StorageError(`Storage key fuori root: ${key}`, "unsafe_object_key");
    }

    return objectPath;
  }

  function sidecarPath(objectPath: string) {
    return `${objectPath}.metadata.json`;
  }

  async function readSidecar(objectPath: string): Promise<MetadataSidecar> {
    try {
      return JSON.parse(await readFile(sidecarPath(objectPath), "utf8")) as MetadataSidecar;
    } catch {
      return {};
    }
  }

  async function headObject(key: string): Promise<StorageObjectMetadata> {
    const objectPath = resolveKey(key);
    const objectStat = await stat(objectPath);
    const sidecar = await readSidecar(objectPath);

    return {
      key,
      size: objectStat.size,
      updatedAt: objectStat.mtime.toISOString(),
      ...sidecar
    };
  }

  async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return walk(fullPath);
        }
        return fullPath.endsWith(".metadata.json") ? [] : [fullPath];
      })
    );

    return files.flat();
  }

  return {
    name: "filesystem",
    async putObject(input: PutObjectInput) {
      const objectPath = resolveKey(input.key);
      const body = toUint8Array(input.body);
      const etag = createHash("sha256").update(body).digest("hex");

      await mkdir(path.dirname(objectPath), { recursive: true });
      await writeFile(objectPath, body);
      await writeFile(
        sidecarPath(objectPath),
        JSON.stringify(
          {
            contentType: input.contentType,
            etag,
            metadata: input.metadata
          } satisfies MetadataSidecar,
          null,
          2
        )
      );

      return headObject(input.key);
    },
    async getObject(key: string) {
      return new Uint8Array(await readFile(resolveKey(key)));
    },
    headObject,
    async deleteObject(key: string) {
      const objectPath = resolveKey(key);
      await rm(objectPath, { force: true });
      await rm(sidecarPath(objectPath), { force: true });
    },
    async createTemporaryReadUrl(key: string) {
      return `file://${resolveKey(key)}`;
    },
    async listObjectsByTender(tenderId: string) {
      const prefix = `tenders/${tenderId}/`;
      const prefixPath = resolveKey(prefix);

      try {
        const files = await walk(prefixPath);
        return Promise.all(
          files.map((file) => {
            const key = path.relative(rootPath, file).split(path.sep).join("/");
            return headObject(key);
          })
        );
      } catch {
        return [];
      }
    }
  };
}
