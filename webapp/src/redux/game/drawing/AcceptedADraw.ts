import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {agreeADrawIn} from "@src/game/record/AgreeADrawIn";

/**
 * The game once the draw on offer has been accepted: the agreement is recorded, so that it can be taken
 * back like any ending, and the offer is done with.
 *
 * **Throws** where nobody has offered one, or the offer was declined — an accepted draw is the answer
 * to a question, and without the question it is a draw the other player never agreed to.
 */
export function acceptedADraw(state: GameSliceState): GameSliceState {
  if (!state.drawOffer || state.drawOffer.declined) throw new Error("There is no draw on offer to accept");

  return {...state, played: agreeADrawIn(state.played), drawOffer: undefined};
}
