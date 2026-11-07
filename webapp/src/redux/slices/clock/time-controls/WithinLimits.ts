import {TIME_CONTROL_LIMITS} from "@src/redux/slices/clock/time-controls/TimeControlLimits";
import type {FigureLimit} from "@src/redux/slices/clock/time-controls/types/FigureLimit";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";

/** The nearest format that can be played: each figure a whole number within its limits, and some time in it somewhere. */
export function withinLimits(timeControl: TimeControl): TimeControl {
  const minutes = within(timeControl.minutes, TIME_CONTROL_LIMITS.minutes);
  const periodSeconds = within(timeControl.periodSeconds, TIME_CONTROL_LIMITS.periodSeconds);
  const periods = within(timeControl.periods, TIME_CONTROL_LIMITS.periods);
  if (minutes === 0 && periods === 0) return {minutes, periodSeconds, periods: 1};

  return {minutes, periodSeconds, periods};
}

function within(figure: number, {min, max}: FigureLimit): number {
  return Math.min(Math.max(Math.trunc(figure), min), max);
}
