import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/**
 * Plain node, not `@cloudflare/vitest-pool-workers`: that pool peers on vitest 4 and this workspace is on
 * 5. What the Worker decides is kept in functions that take a `Request` and a narrow interface to the
 * database, so they run under node's own Web-standard `Request`/`Response`/`crypto`.
 */
export default defineConfig({...vitestBaseConfig, resolve: {tsconfigPaths: true}});
