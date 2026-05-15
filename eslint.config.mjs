import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".venv/**",
      ".local/**",
      "data/packages/**",
      "data/private/**",
      "data/working/**",
      "data/uploads/**",
      "data/ocr/**",
      "data/extracts/**",
      "data/exports/**",
      "data/indexes/**",
      "data/tmp/**",
      "exports/**",
      "reports/**"
    ]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
