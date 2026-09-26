import {TOUR_STEPS} from "@src/react/pages/game/components/onboarding/components/tour/tour-steps/TourSteps";
import {expect, it} from "vitest";

it("gives every step something to be called and something to say", () => {
  expect(Object.values(TOUR_STEPS).every(step => step.title !== "" && step.body !== "")).toBe(true);
});

it("says what the style editor costs from the price the game charges, not a number of its own", () => {
  expect(TOUR_STEPS.styles.body).toContain("300 XP");
});
