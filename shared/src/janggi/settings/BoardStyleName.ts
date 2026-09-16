/**
 * The board styles that ship with the app.
 *
 * A `BoardStyle`'s own `name` stays a plain string, because a user-authored style may be called
 * anything. This list is the built-ins only, and it exists so that both sides of the contract are
 * checked: the webapp cannot ship a built-in whose name is not listed, and an acceptance test
 * cannot ask for a style that does not exist.
 *
 * In the order a player unlocks them. The last five each share their name with a piece set: a theme is
 * a board and a set of pieces made to be worn together, though either may be worn on its own.
 */
export const BOARD_STYLE_NAMES = [
  "Classic",
  "Neon",
  "Diagram",
  "Tournament",
  "Celadon",
  "Dancheong",
  "Hacker",
] as const;

export type BoardStyleName = (typeof BOARD_STYLE_NAMES)[number];
