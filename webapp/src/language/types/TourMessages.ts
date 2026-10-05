import type {TourStepName} from "@janggi/shared/janggi/onboarding/TourStepName";
import type {TourStepWords} from "@src/language/types/TourStepWords";

/** The tour: what each step says, and the card they are told on. */
export interface TourMessages {
  /** Every step's words, given what the style editor costs, which is the game's price to say and not this file's. */
  readonly steps: (styleEditorXp: number) => Record<TourStepName, TourStepWords>;
  readonly card: string;
  readonly stepOf: (step: number, count: number) => string;
  readonly openTheGuide: string;
  readonly skip: string;
  readonly back: string;
  readonly next: string;
  readonly finish: string;
}
