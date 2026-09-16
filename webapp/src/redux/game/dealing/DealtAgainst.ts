import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";

/**
 * A fresh game in the same format, against the opponent as it now stands.
 *
 * The phase is dealt fresh rather than carried across, because which army each arrangement belongs to
 * depends on who is playing it: a scored game laid out for one pairing is not that same game once the
 * other side of the board has changed hands.
 */
export function dealtAgainst(state: GameSliceState, opponent: Opponent): GameSliceState {
  return {...dealtGame(freshPhaseFor(state.phase.format)), opponent};
}
