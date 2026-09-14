import type {GameState} from "@src/game/types/GameState";
import {squareOf} from "@src/bot/notation/squares/SquareOf";

/**
 * A rested turn as the engine writes one: the general of the army to move, going nowhere — `e2e2`.
 * The KJA's own gesture for it is lifting the general and setting it back down, which is near enough
 * the same thing.
 */
export function uciPassFor(state: GameState): string {
  const general = state.pieces.find(({piece}) => piece.side === state.sideToMove && piece.type === "general");
  if (!general) throw new Error(`There is no ${state.sideToMove} general on the board to rest the turn with`);

  const square = squareOf(general.position);

  return `${square}${square}`;
}
