import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {transitionBetween} from "@src/game/record/TransitionBetween";

/**
 * The move that reached the position on the board, or nothing where no move did — the game has just
 * been dealt, or the last turn was rested or a bikjang was called.
 *
 * Read off the record rather than kept: the last position left behind and the one standing say
 * exactly which move went between them, and a mark kept separately would be a second copy of that to
 * clear on every undo.
 */
export function lastMoveOf(played: PlayedGame): Move | undefined {
  const previous = played.past.at(-1);
  if (!previous) return undefined;

  const transition = transitionBetween(previous, played.present);

  return transition?.kind === "moved" ? transition.move : undefined;
}
