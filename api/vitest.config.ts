import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/**
 * Plain node, not `@cloudflare/vitest-pool-workers`: that pool peers on vitest 4 and this workspace is on
 * 5. What the Worker decides is kept in plain functions that take a `Request` and call other plain functions, so they run
 * under node's own Web-standard `Request`/`Response`/`crypto`; `src/testing/SetupApiTests.ts` mocks the ones that reach out
 * (D1, Google, rate limits), and what reads a binding reads `workerEnvironment` like the Worker does, its test filling it.
 */
export default defineConfig({
  ...vitestBaseConfig,
  test: {...vitestBaseConfig.test, setupFiles: ["./src/testing/SetupApiTests.ts"]},
  // `cloudflare:workers` exists only inside the Workers runtime; under node it is a stub with an empty `env`, which a test fills.
  resolve: {
    tsconfigPaths: true,
    alias: {"cloudflare:workers": `${import.meta.dirname}/src/env/testing/CloudflareWorkersStub.ts`},
  },
});
