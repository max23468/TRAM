import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/lib/extractions/*.ts", "src/lib/ingestion/*.ts"],
      exclude: ["src/lib/**/*.test.ts", "src/lib/**/index.ts", "src/lib/**/types.ts"],
      thresholds: {
        statements: 75,
        lines: 75,
        functions: 90,
        branches: 65
      }
    }
  }
});
