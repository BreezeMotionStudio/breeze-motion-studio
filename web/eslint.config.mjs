import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // CMS section data is intentionally loosely typed throughout this codebase.
      // Keep as a warning (visible, not blocking) rather than a commit-blocking error.
      "@typescript-eslint/no-explicit-any": "warn",
      // The scroll-triggered SVG line animations (CoreValuesSection, HowWeWorkSection) measure
      // DOM layout on mount/resize and set state from that — a deliberate, working pattern.
      // Warn instead of block so it doesn't gate commits on files using this by design.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
