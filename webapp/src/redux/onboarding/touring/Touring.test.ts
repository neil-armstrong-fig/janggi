import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import {TOUR_STEP_COUNT} from "@src/redux/onboarding/touring/TourStepCount";
import {expect, it} from "vitest";
import {tourBegun, tourStepBack, tourStepForward} from "@src/redux/onboarding/touring/Touring";

const atStep = (tourStep: number): OnboardingSliceState => ({stage: "tour", tourStep});
const LAST = TOUR_STEP_COUNT - 1;

it("begins at the first step, from the welcome or from a tour finished long ago", () => {
  expect(tourBegun()).toEqual(atStep(0));
});

it("goes forward one step at a time", () => {
  expect(tourStepForward(atStep(2))).toEqual(atStep(3));
});

it("is finished by going forward from the last step", () => {
  expect(tourStepForward(atStep(LAST))).toEqual({stage: "done", tourStep: 0});
});

it("goes back one step at a time", () => {
  expect(tourStepBack(atStep(3))).toEqual(atStep(2));
});

it("stays on the first step when asked to go back from it", () => {
  expect(tourStepBack(atStep(0))).toEqual(atStep(0));
});

it("leaves alone a player who is not on the tour, whichever way it is asked to go", () => {
  const welcome: OnboardingSliceState = {stage: "welcome", tourStep: 0};
  const done: OnboardingSliceState = {stage: "done", tourStep: 0};

  expect([tourStepForward(welcome), tourStepBack(welcome), tourStepForward(done), tourStepBack(done)]).toEqual([
    welcome,
    welcome,
    done,
    done,
  ]);
});
