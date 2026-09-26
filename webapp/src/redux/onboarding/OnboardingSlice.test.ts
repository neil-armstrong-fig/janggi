import {
  onboardingReducer,
  onboardingSkipped,
  tourStarted,
  tourSteppedBack,
  tourSteppedForward,
} from "@src/redux/onboarding/OnboardingSlice";
import {expect, it} from "vitest";

const initial = onboardingReducer(undefined, {type: "@@init"});

it("starts on the welcome", () => {
  expect(initial).toEqual({stage: "welcome", tourStep: 0});
});

it("starts the tour from the welcome", () => {
  expect(onboardingReducer(initial, tourStarted())).toEqual({stage: "tour", tourStep: 0});
});

it("steps through the tour and back", () => {
  const second = onboardingReducer(onboardingReducer(initial, tourStarted()), tourSteppedForward());

  expect(second).toEqual({stage: "tour", tourStep: 1});
  expect(onboardingReducer(second, tourSteppedBack())).toEqual({stage: "tour", tourStep: 0});
});

it("is done once skipped, from the welcome or from the middle of the tour", () => {
  const midway = onboardingReducer(onboardingReducer(initial, tourStarted()), tourSteppedForward());

  expect(onboardingReducer(initial, onboardingSkipped())).toEqual({stage: "done", tourStep: 0});
  expect(onboardingReducer(midway, onboardingSkipped())).toEqual({stage: "done", tourStep: 0});
});
