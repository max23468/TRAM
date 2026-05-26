import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function usage() {
  console.error("Usage: npm run demo:extract-text -- <package-id>");
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with ${code}: ${stderr.trim()}`));
    });
  });
}

function assertSafePackageId(packageId) {
  if (!/^[a-z0-9._-]+$/.test(packageId)) {
    throw new Error("Package id non sicuro.");
  }
}

const [packageId] = process.argv.slice(2);

if (!packageId) {
  usage();
  process.exit(2);
}

assertSafePackageId(packageId);

const cwd = process.cwd();
const inventoryPath = path.join(
  cwd,
  "data",
  "working",
  packageId,
  "inventory",
  "local-inventory.json"
);
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const outputDir = path.join(cwd, "data", "working", packageId, "text-extracts");
const packageRoot = path.join(cwd, "data", "packages", packageId);
let extractedCount = 0;
let skippedCount = 0;
let failedCount = 0;

await mkdir(outputDir, { recursive: true });

for (const file of inventory.files) {
  if (file.extension !== ".pdf") {
    skippedCount += 1;
    continue;
  }

  const sourcePath = path.resolve(packageRoot, file.relativePath);

  if (!sourcePath.startsWith(packageRoot)) {
    failedCount += 1;
    continue;
  }

  const outputPath = path.join(outputDir, `${file.id}.txt`);

  try {
    await run("pdftotext", ["-layout", sourcePath, outputPath]);
    extractedCount += 1;
  } catch {
    failedCount += 1;
  }
}

await writeFile(
  path.join(outputDir, "summary.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      packageId,
      extractedCount,
      failedCount,
      skippedCount
    },
    null,
    2
  )}\n`
);

console.log(
  JSON.stringify(
    {
      outputDir: path.relative(cwd, outputDir),
      extractedCount,
      failedCount,
      skippedCount
    },
    null,
    2
  )
);
