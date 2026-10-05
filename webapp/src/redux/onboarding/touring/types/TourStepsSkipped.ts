import type {TourStepName} from "@janggi/shared/janggi/onboarding/TourStepName";

/** The steps the tour goes past rather than shows, which the page says because it knows what applies to this player. */
export interface TourStepsSkipped {
  readonly skipping: readonly TourStepName[];
}
