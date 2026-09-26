import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {TourStepName} from "@src/redux/onboarding/touring/TourStepName";
import {TOUR_STEP_NAMES} from "@src/redux/onboarding/touring/TourStepName";

/** Which step of the tour is up, or undefined where the player is not on it. */
export function tourStepNameOf(state: OnboardingSliceState): TourStepName | undefined {
  return state.stage === "tour" ? TOUR_STEP_NAMES[state.tourStep] : undefined;
}
