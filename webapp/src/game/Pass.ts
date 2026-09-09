import type {GameState} from "@src/game/types/GameState";
import {isInCheck} from "@src/game/IsInCheck";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * The game after a rested turn: every piece where it was, the other army to move, and one more pass
 * on the count.
 *
 * A pass is not a `Move` and is deliberately not in `legalMovesFor` — "한수 쉼은 행마(수)에
 * 해당하지 않으며", a pass is not a move. Keeping it out is what leaves the thirty-one openings and
 * `isCheckmate` saying what they always said, and it is why this is its own entry point beside
 * `applyMove` rather than a third shape of one.
 *
 * The count is what makes a pass matter: rested twice in a row and the game stops, to be settled on
 * points by `outcomeOf`. Any move puts it back to nought, in `positionAfter`.
 *
 * **Throws** when the turn may not be rested, exactly as `applyMove` throws on an illegal move and
 * for the same reason — the caller has just been told by `canPass`.
 */
export function pass(state: GameState): GameState {
  if (outcomeOf(state).kind !== "undecided") throw new Error("The game is over, so there is no turn left to rest");

  if (isInCheck(state, state.sideToMove)) {
    throw new Error(`${state.sideToMove} is in check, and resting the move does not answer it`);
  }

  return {
    pieces: state.pieces,
    sideToMove: opponentOf(state.sideToMove),
    consecutivePasses: state.consecutivePasses + 1,
  };
}
