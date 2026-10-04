import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {TourStepsSkipped} from "@src/redux/onboarding/touring/types/TourStepsSkipped";
import {TOUR_STEP_NAMES} from "@src/redux/onboarding/touring/TourStepName";
import {TOUR_STEP_COUNT} from "@src/redux/onboarding/touring/TourStepCount";
import {expect, it} from "vitest";
import {tourBegun, tourStepBack, tourStepForward} from "@src/redux/onboarding/touring/Touring";

const atStep = (tourStep: number): OnboardingSliceState => ({stage: "tour", tourStep});
const LAST = TOUR_STEP_COUNT - 1;
const skippingNothing: TourStepsSkipped = {skipping: []};
const skippingFriend: TourStepsSkipped = {skipping: ["friend"]};

it("begins at the first step, from the welcome or from a tour finished long ago", () => {
  expect(tourBegun()).toEqual(atStep(0));
});

it("goes forward one step at a time", () => {
  expect(tourStepForward(atStep(2), skippingNothing)).toEqual(atStep(3));
});

it("is finished by going forward from the last step", () => {
  expect(tourStepForward(atStep(LAST), skippingNothing)).toEqual({stage: "done", tourStep: 0});
});

it("goes back one step at a time", () => {
  expect(tourStepBack(atStep(3), skippingNothing)).toEqual(atStep(2));
});

it("stays on the first step when asked to go back from it", () => {
  expect(tourStepBack(atStep(0), skippingNothing)).toEqual(atStep(0));
});

it("leaves alone a player who is not on the tour, whichever way it is asked to go", () => {
  const welcome: OnboardingSliceState = {stage: "welcome", tourStep: 0};
  const done: OnboardingSliceState = {stage: "done", tourStep: 0};

  expect([
    tourStepForward(welcome, skippingNothing),
    tourStepBack(welcome, skippingNothing),
    tourStepForward(done, skippingNothing),
    tourStepBack(done, skippingNothing),
  ]).toEqual([welcome, welcome, done, done]);
});

it("goes past a skipped step going forward", () => {
  const account = TOUR_STEP_NAMES.indexOf("account");

  expect(tourStepForward(atStep(account), skippingFriend)).toEqual(atStep(account + 2));
});

it("goes past a skipped step going back", () => {
  const guide = TOUR_STEP_NAMES.indexOf("guide");

  expect(tourStepBack(atStep(guide), skippingFriend)).toEqual(atStep(guide - 2));
});

it("is finished by going forward when every step after is skipped", () => {
  const account = TOUR_STEP_NAMES.indexOf("account");

  expect(tourStepForward(atStep(account), {skipping: ["friend", "guide"]})).toEqual({stage: "done", tourStep: 0});
});

it("stays put going back when every step before is skipped", () => {
  expect(tourStepBack(atStep(1), {skipping: ["pick-up"]})).toEqual(atStep(1));
});
