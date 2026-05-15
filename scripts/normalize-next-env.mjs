import { readFileSync, writeFileSync } from "node:fs";

const nextEnvPath = new URL("../next-env.d.ts", import.meta.url);
const expected = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;

const current = readFileSync(nextEnvPath, "utf8");

if (current !== expected) {
  writeFileSync(nextEnvPath, expected);
}
