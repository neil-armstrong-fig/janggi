import {TOUR_STEP_NAMES} from "@janggi/shared/janggi/onboarding/TourStepName";
import {TOUR_STEPS} from "@src/react/pages/game/components/onboarding/components/tour/tour-steps/TourSteps";
import {expect, it} from "vitest";

it("says what each step does to the page, for every step the store names", () => {
  expect(Object.keys(TOUR_STEPS)).toEqual([...TOUR_STEP_NAMES]);
});
