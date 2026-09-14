import {BOT_GAME_TESTS} from "./vitest.config";
import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/**
 * The bot games only. `vitest.config.ts` runs everything except these and the property tests, and
 * `vitest.properties.config.ts` runs the property tests, so between the three every test file is
 * covered exactly once.
 *
 * Each game sets its own timeout, since how long a game may take is that test's business.
 */
export default defineConfig({
  ...vitestBaseConfig,
  resolve: {tsconfigPaths: true},
  test: {
    ...vitestBaseConfig.test,
    environment: "node",
    include: BOT_GAME_TESTS,
  },
});
