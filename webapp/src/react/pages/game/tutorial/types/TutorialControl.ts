/** The controls under the board a step of the tutorial may ask for: resting a turn, calling a bikjang, offering a draw. */
export const TUTORIAL_CONTROLS = ["pass", "bikjang", "draw"] as const;

export type TutorialControl = (typeof TUTORIAL_CONTROLS)[number];
