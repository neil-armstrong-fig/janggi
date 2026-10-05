/**
 * The tour's steps, in the order a player meets them: picking a piece up, moving it, the controls, the
 * settings button, the XP, the styles they have yet to earn, the optional sign-in, playing a friend (shown only to a player who is signed in), and the guide. Named rather than numbered, so
 * the page's card for each is a record over exactly these and cannot fall out of step with the store,
 * and the board can ask which step is up without knowing where in the tour it falls.
 */
export const TOUR_STEP_NAMES = [
  "pick-up",
  "move",
  "controls",
  "settings",
  "xp",
  "styles",
  "account",
  "friend",
  "guide",
] as const;

export type TourStepName = (typeof TOUR_STEP_NAMES)[number];
