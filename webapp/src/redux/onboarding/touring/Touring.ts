import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {TourStepsSkipped} from "@src/redux/onboarding/touring/types/TourStepsSkipped";
import {TOUR_STEP_NAMES} from "@src/redux/onboarding/touring/TourStepName";

/** The tour, at its first step. */
export function tourBegun(): OnboardingSliceState {
  return {stage: "tour", tourStep: 0};
}

/** The next step not skipped, and the tour finished by going on from the last. Nothing happens off the tour. */
export function tourStepForward(state: OnboardingSliceState, {skipping}: TourStepsSkipped): OnboardingSliceState {
  if (state.stage !== "tour") return state;

  const next = TOUR_STEP_NAMES.findIndex((name, index) => index > state.tourStep && !skipping.includes(name));
  if (next === -1) return {stage: "done", tourStep: 0};

  return {...state, tourStep: next};
}

/** The step before, not skipped, and no further than the first. Nothing happens off the tour. */
export function tourStepBack(state: OnboardingSliceState, {skipping}: TourStepsSkipped): OnboardingSliceState {
  if (state.stage !== "tour") return state;

  const previous = TOUR_STEP_NAMES.findLastIndex((name, index) => index < state.tourStep && !skipping.includes(name));
  if (previous === -1) return state;

  return {...state, tourStep: previous};
}
