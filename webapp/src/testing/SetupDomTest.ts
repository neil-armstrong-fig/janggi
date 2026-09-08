/**
 * What a test needs before it may touch a DOM: the jest-dom matchers, and unmounting whatever it
 * rendered afterwards.
 *
 * Imported by the tests that need it rather than configured as a global `setupFiles`, because
 * loading `@testing-library` costs every file in the package roughly as much as building the DOM
 * does, and only hook tests use it. A hook test opens with both lines:
 *
 * ```ts
 * // @vitest-environment jsdom
 * import "@src/testing/SetupDomTest";
 * ```
 *
 * Forget the import and the jest-dom matchers are simply missing, which is what the first failure
 * will say.
 */
import "@testing-library/jest-dom/vitest";
import {cleanup} from "@testing-library/react";
import {afterEach} from "vitest";

afterEach(() => {
  cleanup();
});
