import type {CharacterSet} from "@src/styles/types/CharacterSet";

/**
 * The pieces as a roguelike draws its dungeon: `@` is you — here, the general everything else is
 * protecting — and every other piece a single capital letter, its English name's initial where that is
 * free. The chariot takes R, for the rook it moves like, because C is the cannon's.
 */
export const HACKER_CHARACTERS: CharacterSet = {
  general: "@",
  guard: "G",
  horse: "H",
  elephant: "E",
  chariot: "R",
  cannon: "C",
  soldier: "S",
};
