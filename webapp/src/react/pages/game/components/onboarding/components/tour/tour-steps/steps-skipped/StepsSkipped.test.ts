import {expect, it} from "vitest";
import {stepsSkipped} from "@src/react/pages/game/components/onboarding/components/tour/tour-steps/steps-skipped/StepsSkipped";

it("skips the step about playing a friend while the player is signed out", () => {
  expect(stepsSkipped(false)).toEqual(["friend"]);
});

it("skips nothing once the player is signed in", () => {
  expect(stepsSkipped(true)).toEqual([]);
});
