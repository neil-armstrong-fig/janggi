import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/** Unit tests for the DSL itself. The acceptance specs under `src/tests` are excluded. */
export default defineConfig({
  ...vitestBaseConfig,
  resolve: {tsconfigPaths: true},
  test: {
    ...vitestBaseConfig.test,
    exclude: ["**/node_modules/**", "src/tests/**"],
  },
});
