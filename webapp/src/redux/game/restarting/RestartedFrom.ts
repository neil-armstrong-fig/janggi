import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {dealtAgainst} from "@src/redux/game/dealing/DealtAgainst";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";

/**
 * The same game dealt again. A Random side takes the roll it is handed; a chosen side ignores it, the
 * roll having been made before anyone knew whether it was wanted — a reducer may not roll dice of its own.
 *
 * **Only a roll that actually moves the player to the other army costs the arrangements.** Starting again
 * otherwise keeps both, which in a scored game is the rule rather than a convenience: Han may not revise,
 * and starting again is not a way round that.
 */
export function restartedFrom(state: GameSliceState, roll: Side): GameSliceState {
  const playerSide = state.opponent.sideChoice === "Random" ? roll : state.opponent.playerSide;
  if (playerSide === state.opponent.playerSide) return {...dealtGame(state.phase), opponent: state.opponent};

  return dealtAgainst(state, {...state.opponent, playerSide});
}
