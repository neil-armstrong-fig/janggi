import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {configDefaults, defineConfig} from "vitest/config";

/**
 * The property tests, which `pnpm test` deliberately leaves out.
 *
 * They play thousands of randomly generated games against a fresh seed each run, so unlike every
 * other test here a failure is not reproducible from the same commit — it means "these particular
 * random games found something", which is worth investigating but is not a reason to block a
 * deploy. They run on their own schedule, in their own workflow, through
 * `vitest.properties.config.ts`.
 *
 * Listed by path rather than matched by a suffix because there is one of them. Add the second here
 * when it exists.
 */
export const PROPERTY_TESTS = ["src/game/PlayingRandomGames.test.ts"];

/**
 * **node, not jsdom.** Building a DOM is by far the most expensive thing a run does — 27 files spent
 * 75% of their time on it — and almost nothing here needs one: reducers, selectors, the engine and
 * every plain function are pure. Components are not unit tested at all, by the rule in `AGENTS.md`.
 *
 * A test that does need a DOM opts in with two lines of its own, and pays for it alone:
 *
 * ```ts
 * // @vitest-environment jsdom
 * import "@src/testing/SetupDomTest";
 * ```
 */
export default defineConfig({
  ...vitestBaseConfig,
  resolve: {tsconfigPaths: true},
  test: {
    ...vitestBaseConfig.test,
    environment: "node",
    exclude: [...configDefaults.exclude, ...PROPERTY_TESTS],
  },
});
