import type {ClockReadingState} from "@src/redux/clock/reading/types/ClockReadingState";

/** What one army's clock shows. */
export interface ClockReading {
  readonly state: ClockReadingState;
  readonly seconds: number;
  /** The periods left, counting the one being spent. */
  readonly periods: number;
}
