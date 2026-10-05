import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {TourStepName} from "@janggi/shared/janggi/onboarding/TourStepName";
import {TOUR_STEP_NAMES} from "@janggi/shared/janggi/onboarding/TourStepName";

/** Which step of the tour is up, or undefined where the player is not on it. */
export function tourStepNameOf(state: OnboardingSliceState): TourStepName | undefined {
  if (state.stage === "tour") {
    return TOUR_STEP_NAMES[state.tourStep];
  }

  return undefined;
}
