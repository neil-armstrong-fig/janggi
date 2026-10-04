import type {TourStepName} from "@src/redux/onboarding/touring/TourStepName";

/** The steps the tour goes past rather than shows, which the page says because it knows what applies to this player. */
export interface TourStepsSkipped {
  readonly skipping: readonly TourStepName[];
}
