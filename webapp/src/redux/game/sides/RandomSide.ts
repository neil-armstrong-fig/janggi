import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * An army at random, for a player who asked not to choose.
 *
 * It is rolled where an action is made rather than inside a reducer: replaying the same actions must deal
 * the same game, which a reducer rolling its own dice would not.
 */
export function randomSide(): Side {
  return Math.random() < 0.5 ? "cho" : "han";
}
