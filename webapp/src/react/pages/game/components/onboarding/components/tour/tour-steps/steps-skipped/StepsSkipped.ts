import type {TourStepName} from "@janggi/shared/janggi/onboarding/TourStepName";
import {TOUR_STEPS} from "@src/react/pages/game/components/onboarding/components/tour/tour-steps/TourSteps";
import {TOUR_STEP_NAMES} from "@janggi/shared/janggi/onboarding/TourStepName";

/** The steps the tour goes past for this player: those that need a sign-in, while they are signed out. */
export function stepsSkipped(signedIn: boolean): readonly TourStepName[] {
  if (signedIn) return [];

  return TOUR_STEP_NAMES.filter(name => TOUR_STEPS[name].needsSignIn);
}
