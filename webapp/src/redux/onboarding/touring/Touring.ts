import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import {TOUR_STEP_COUNT} from "@src/redux/onboarding/touring/TourStepCount";

/** The tour, at its first step. */
export function tourBegun(): OnboardingSliceState {
  return {stage: "tour", tourStep: 0};
}

/** One step on, and the tour finished by going on from the last. Nothing happens off the tour. */
export function tourStepForward(state: OnboardingSliceState): OnboardingSliceState {
  if (state.stage !== "tour") return state;
  if (state.tourStep >= TOUR_STEP_COUNT - 1) return {stage: "done", tourStep: 0};

  return {...state, tourStep: state.tourStep + 1};
}

/** One step back, and no further than the first. Nothing happens off the tour. */
export function tourStepBack(state: OnboardingSliceState): OnboardingSliceState {
  if (state.stage !== "tour") return state;

  return {...state, tourStep: Math.max(0, state.tourStep - 1)};
}
