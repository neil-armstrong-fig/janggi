import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";

/** What the settings sheet is doing while a step is up: put away, or open on a tab. */
export type TourSheet = "closed" | SettingsTabName;

/** What moves a step on by itself: tapping what it points at, or a move being made. */
export type TourAdvance = "tap" | "move";

/** One card of the tour: what it is called, what it says, and what it does to the page it is over. */
export interface TourStep {
  readonly title: string;
  readonly body: string;
  /** What the spotlight goes round, where there is something to go round. */
  readonly target?: TourTargetName;
  /** What the settings sheet is put to as the step comes up. */
  readonly sheet: TourSheet;
  /** What moves the step on besides the player pressing Next. */
  readonly advance?: TourAdvance;
  /** Whether the step offers the guide in a new tab. */
  readonly offersTheGuide?: boolean;
}
