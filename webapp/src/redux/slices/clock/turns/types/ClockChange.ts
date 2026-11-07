import type {PlayedGame} from "@src/record/types/PlayedGame";
import type {RecordChange} from "@src/record/change/types/RecordChange";

/** One change to the record, the record it left, and how the clock stood when it came. */
export interface ClockChange {
  readonly change: RecordChange;
  readonly played: PlayedGame;
  /** Whether this game has a clock. */
  readonly inUse: boolean;
  /** Whether a turn was being timed. */
  readonly running: boolean;
}
