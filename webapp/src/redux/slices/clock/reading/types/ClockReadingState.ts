/** How a clock is reading: in free time, in a period, in the last moments of the last period, or out of time. */
export type ClockReadingState = "free" | "overtime" | "low" | "lost";
