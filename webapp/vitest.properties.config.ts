import {PROPERTY_TESTS} from "./vitest.config";
import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/**
 * The property tests only. `vitest.config.ts` runs everything except these and the bot games, and
 * `vitest.bot-games.config.ts` runs the bot games, so between the three every test file is covered
 * exactly once.
 *
 * `PROPERTY_TEST_RUNS` sets how many random games each property is put through. The default suits a
 * laptop; the workflow turns it up, because the whole value of a scheduled run is that it explores
 * seeds nobody has tried.
 */
export default defineConfig({
  ...vitestBaseConfig,
  resolve: {tsconfigPaths: true},
  test: {
    ...vitestBaseConfig.test,
    environment: "node",
    include: PROPERTY_TESTS,
    /**
     * Vitest's default is 5 seconds, which suits a unit test and not this. A property plays
     * `PROPERTY_TEST_RUNS` whole games, the workflow turns that up to 5000 nightly, and checking
     * for check makes every move markedly more expensive — so the honest fix for a timeout here is
     * a longer clock, not fewer games.
     */
    testTimeout: 300_000,
  },
});
