/**
 * What the Preview row can stand the clocks in, to judge how each looks. Nothing runs yet, so nothing else reaches
 * these states; the row and this list go once the clocks do.
 */
export const CLOCK_POSES = ["Start", "Free time", "Overtime", "Low time", "Time lost"] as const;

export type ClockPose = (typeof CLOCK_POSES)[number];
