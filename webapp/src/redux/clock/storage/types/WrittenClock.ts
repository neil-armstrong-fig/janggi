import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

/** The clock as it is written to the device. */
export interface WrittenClock extends ClockSliceState {
  /**
   * When the page was left with this turn running. Only the last write as a page goes has it, so any later write clears
   * it.
   */
  readonly leftAt?: number | undefined;
}
