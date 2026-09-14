import type {
  AcceptanceTestFixtures,
  AnotherDeviceFixtures,
} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import {test} from "@src/acceptance-criteria-mapping/AcceptanceTestFixtures";

type DefineSuite = () => void;

/**
 * A criterion sees the DSL and nothing else — no `page`, `context`, `browser` or `testInfo`.
 * Playwright stays on this side of the boundary, so a spec cannot reach past the DSL and start
 * driving the browser directly.
 */
type RunCriterion = (dsl: AcceptanceTestFixtures) => void | Promise<void>;

/** An arrangement handed a second device as well as the app, and still nothing but the DSL for each. */
type ArrangeOnTwoDevices = (dsl: AcceptanceTestFixtures & AnotherDeviceFixtures) => void | Promise<void>;

type PlaywrightTestBody = (fixtures: AcceptanceTestFixtures) => Promise<void>;

type PlaywrightTwoDeviceBody = (fixtures: AcceptanceTestFixtures & AnotherDeviceFixtures) => Promise<void>;

interface Suite {
  (criteria: string, define: DefineSuite): void;
  only(criteria: string, define: DefineSuite): void;
  skip(criteria: string, define: DefineSuite): void;
  /**
   * The same block, once per item — for a criterion that holds for every member of a set.
   *
   * Playwright has no `test.each` or `describe.each`; its answer to a parameterised test is a `for`
   * loop around `test()`, and this is that loop with the given/when/then naming kept. One suite per
   * item beats one criterion looping inside itself: each gets its own page, a failure names the
   * item that failed rather than the whole set, and the arrangement can sit in a `beforeEach` where
   * it belongs.
   */
  each<Item>(items: readonly Item[], name: NameFor<Item>, define: DefineSuiteFor<Item>): void;
}

/** What one item of an `each` is called, as the `when` a reader sees in the report. */
type NameFor<Item> = (item: Item) => string;

/** The block an `each` repeats, handed the item it is being repeated for. */
type DefineSuiteFor<Item> = (item: Item) => void;

interface Criterion {
  (criteria: string, run: RunCriterion): void;
  only(criteria: string, run: RunCriterion): void;
  skip(criteria: string, run: RunCriterion): void;
}

interface Arrangement {
  (arrange: RunCriterion): void;
  /**
   * The same, handed the app open on a second device as well as `janggi`. Only an arrangement that
   * asks for one opens one: Playwright builds a fixture for a test only where something names it, and
   * this is the one place `anotherDevice` is named. The criterion beneath it runs against the same two.
   */
  withAnotherDevice(arrange: ArrangeOnTwoDevices): void;
}

/**
 * The DSL as a type, for a spec's own helper that is handed a device — `PlayingTheBotToTheEnd.test.ts`
 * relays turns between two. A spec may import nothing but this module, so the name is exported here.
 */
export type Janggi = AcceptanceTestFixtures["janggi"];

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

/**
 * The arrangement a `given` or a `when` has just named, carried out before each criterion beneath
 * it.
 *
 * A `when` says something happened. Without this, every `then` under it has to make it happen again
 * in its own body, and the criterion — the one line that spec is actually about — ends up buried
 * under setup it shares with its siblings. Anything a `then` does to the app before asserting
 * belongs up here.
 *
 * It receives the DSL and nothing else, exactly as a criterion does. Playwright builds the fixtures
 * fresh for each test, so this runs against the same `janggi` the criterion gets, on a page that is
 * genuinely back at the start.
 */
export const beforeEach = arrangement();

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
  wrapped.each = <Item>(items: readonly Item[], name: NameFor<Item>, define: DefineSuiteFor<Item>): void => {
    for (const item of items) {
      test.describe(`${prefix} ${name(item)}`, () => {
        define(item);
      });
    }
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

function arrangement(): Arrangement {
  const wrapped = (arrange: RunCriterion): void => {
    test.beforeEach(withDslOnly(arrange));
  };
  wrapped.withAnotherDevice = (arrange: ArrangeOnTwoDevices): void => {
    test.beforeEach(withBothDevices(arrange));
  };

  return wrapped;
}

/**
 * Rebuilds the argument object so a criterion receives only the DSL, whatever else Playwright
 * passed in. Types alone would stop at a cast; this stops at runtime too.
 *
 * The destructuring here is also how Playwright decides which fixtures to build — it reads the
 * parameter names off this function — so a fixture added to `AcceptanceTestFixtures` must be
 * named here as well. `anotherDevice` deliberately is not: named here, every spec would open one.
 */
function withDslOnly(run: RunCriterion): PlaywrightTestBody {
  return async ({janggi}: AcceptanceTestFixtures): Promise<void> => {
    await run({janggi});
  };
}

/** `withDslOnly` for an arrangement on two devices. Its destructuring is what has Playwright open the second. */
function withBothDevices(arrange: ArrangeOnTwoDevices): PlaywrightTwoDeviceBody {
  return async ({janggi, anotherDevice}: AcceptanceTestFixtures & AnotherDeviceFixtures): Promise<void> => {
    await arrange({janggi, anotherDevice});
  };
}
