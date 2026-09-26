import {expect, it} from "vitest";
import {tourStepNameOf} from "@src/redux/onboarding/touring/TourStepNameOf";

it("names the step the tour is on", () => {
  expect(tourStepNameOf({stage: "tour", tourStep: 0})).toBe("pick-up");
  expect(tourStepNameOf({stage: "tour", tourStep: 6})).toBe("guide");
});

it("names none for a player who is not on the tour", () => {
  expect(tourStepNameOf({stage: "welcome", tourStep: 0})).toBeUndefined();
  expect(tourStepNameOf({stage: "done", tourStep: 0})).toBeUndefined();
});
