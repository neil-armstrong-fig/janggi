import {expect, it} from "vitest";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

it("carries the format the game it lays out will be played under", () => {
  expect(setupPhaseFor("Scored").format).toBe("Scored");
  expect(setupPhaseFor("Casual").format).toBe("Casual");
});

/**
 * Not defaulted to `DEFAULT_SETUP`, and this is the test that says so. "Has laid out" is the whole
 * of the state the rule turns on, and a default would have han looking as though it had already
 * chosen before touching anything — which in a scored game locks han out of its only choice.
 */
it("starts with neither army laid out", () => {
  const phase = setupPhaseFor("Scored");

  expect(phase.hanSetup).toBeUndefined();
  expect(phase.choSetup).toBeUndefined();
});
