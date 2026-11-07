import type {FigureLimit} from "@src/redux/slices/clock/time-controls/types/FigureLimit";
import type {TimeControlFigure} from "@janggi/shared/janggi/settings/TimeControlFigure";

/** How far a format written out may go. No periods is free time alone, and no free time starts in the first period. */
export const TIME_CONTROL_LIMITS: Readonly<Record<TimeControlFigure, FigureLimit>> = {
  minutes: {min: 0, max: 180},
  periodSeconds: {min: 5, max: 120},
  periods: {min: 0, max: 60},
};
