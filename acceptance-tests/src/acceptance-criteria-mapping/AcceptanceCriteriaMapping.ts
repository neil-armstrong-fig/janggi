import type {AcceptanceTestFixtures} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import {test} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";

type DefineSuite = () => void;

/**
 * A criterion sees the DSL and nothing else — no `page`, `context`, `browser` or `testInfo`.
 * Playwright stays on this side of the boundary, so a spec cannot reach past the DSL and start
 * driving the browser directly.
 */
type RunCriterion = (dsl: AcceptanceTestFixtures) => void | Promise<void>;

type PlaywrightTestBody = (fixtures: AcceptanceTestFixtures) => Promise<void>;

interface Suite {
  (criteria: string, define: DefineSuite): void;
  only(criteria: string, define: DefineSuite): void;
  skip(criteria: string, define: DefineSuite): void;
}

interface Criterion {
  (criteria: string, run: RunCriterion): void;
  only(criteria: string, run: RunCriterion): void;
  skip(criteria: string, run: RunCriterion): void;
}

/**
 * `given` / `when` / `then` are thin wrappers over Playwright's `test.describe` / `test` that
 * prefix the block name, so a test run reads back as the acceptance criteria it was written from:
 *
 *   given a user opens the game for the first time > when the page has loaded > then ...
 *
 * `then` is the test itself, which is why it — and only it — receives the DSL.
 */
export const given = suite("given");
export const when = suite("when");
export const then = criterion("then");

export {expect} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";

function suite(prefix: string): Suite {
  const wrapped = (criteria: string, define: DefineSuite): void => {
    test.describe(`${prefix} ${criteria}`, define);
  };
  wrapped.only = (criteria: string, define: DefineSuite): void => {
    test.describe.only(`${prefix} ${criteria}`, define);
  };
  wrapped.skip = (criteria: string, define: DefineSuite): void => {
    test.describe.skip(`${prefix} ${criteria}`, define);
  };

  return wrapped;
}

function criterion(prefix: string): Criterion {
  const wrapped = (criteria: string, run: RunCriterion): void => {
    test(`${prefix} ${criteria}`, withDslOnly(run));
  };
  wrapped.only = (criteria: string, run: RunCriterion): void => {
    test.only(`${prefix} ${criteria}`, withDslOnly(run));
  };
  wrapped.skip = (criteria: string, run: RunCriterion): void => {
    test.skip(`${prefix} ${criteria}`, withDslOnly(run));
  };

  return wrapped;
}

/**
 * Rebuilds the argument object so a criterion receives only the DSL, whatever else Playwright
 * passed in. Types alone would stop at a cast; this stops at runtime too.
 *
 * The destructuring here is also how Playwright decides which fixtures to build — it reads the
 * parameter names off this function — so a fixture added to `AcceptanceTestFixtures` must be
 * named here as well.
 */
function withDslOnly(run: RunCriterion): PlaywrightTestBody {
  return async ({board}: AcceptanceTestFixtures): Promise<void> => {
    await run({board});
  };
}
