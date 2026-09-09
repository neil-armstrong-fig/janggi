import type {GameState} from "@src/game/types/GameState";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether the game has ended, and so whether the board should still answer a player at all.
 *
 * A checkmate needs no help here — a mated army has no legal move, so nothing is offered and
 * nothing can be tapped. A game stopped by two rested turns is the case that does: the position
 * still has plenty to play, `applyMove` refuses it, and without this the board would light a piece
 * up and then throw when it was put down.
 *
 * Asked here rather than in the engine because a move that ends a game is still a move the position
 * allows — `legalMovesFor` has to keep saying so, or `isCheckmate` could not ask it whether a check
 * has any reply.
 */
export function gameIsOver(game: GameState): boolean {
  return outcomeOf(game).kind !== "undecided";
}
