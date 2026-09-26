/**
 * The tour's steps, in the order a player meets them: picking a piece up, moving it, the controls, the
 * settings button, the XP, the styles they have yet to earn, and the guide. Named rather than numbered, so
 * the page's card for each is a record over exactly these and cannot fall out of step with the store,
 * and the board can ask which step is up without knowing where in the tour it falls.
 */
export const TOUR_STEP_NAMES = ["pick-up", "move", "controls", "settings", "xp", "styles", "guide"] as const;

export type TourStepName = (typeof TOUR_STEP_NAMES)[number];
