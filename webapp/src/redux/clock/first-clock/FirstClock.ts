import {DEFAULT_TIME_CONTROL} from "@janggi/shared/janggi/settings/TimeControlName";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

/**
 * The clock a player first meets: off, ready to turn on at ten minutes. What the slice starts from, and what a clock kept
 * on the device falls back to where there is none.
 */
export const FIRST_CLOCK: ClockSliceState = {
  name: DEFAULT_TIME_CONTROL,
  formatWhenOn: "10 min",
  custom: {minutes: 10, periodSeconds: 30, periods: 3},
};
