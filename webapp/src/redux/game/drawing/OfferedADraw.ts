import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {canAgreeADraw} from "@src/game/drawing/CanAgreeADraw";

/**
 * The game once the army to move has offered the other a draw. It moves nothing and takes nobody's
 * turn — the offer is a question, and only an answer of yes reaches the record. See `docs/rules.md` §6.4.
 *
 * **Throws** where there is no draw to offer, as `takenBack` would on a record with nothing to take back:
 * the control is disabled off `canAgreeADraw`, so a dispatch that reached here is a bug at the control.
 */
export function offeredADraw(state: GameSliceState): GameSliceState {
  const game = state.played.present;
  if (!canAgreeADraw(game)) throw new Error("A draw may be offered in a casual game that is still being played");

  return {...state, drawOffer: {by: game.sideToMove, declined: false}};
}
