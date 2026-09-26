/**
 * What the tour can point at on the real page: a point on the board (the piece to pick up, and then the
 * place to put it), the row of controls, the settings button, the XP, and the player's own styles.
 * The webapp marks each one on the element itself and the acceptance tests ask the spotlight which
 * it is round, so the two agree on the words.
 */
export const TOUR_TARGET_NAMES = ["point", "controls", "settings", "xp", "styles"] as const;

export type TourTargetName = (typeof TOUR_TARGET_NAMES)[number];
