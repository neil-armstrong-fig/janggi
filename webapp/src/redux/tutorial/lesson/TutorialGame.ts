import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";

/**
 * The game the tutorial is played on: casual, both armies on the common arrangement, the player as Cho. The opponent is
 * dealt as a person at the same device, so nothing is rated, nothing earns XP and the bot's engine never starts; the
 * script answers for Han instead. The bot's strength and side choice are carried over untouched, for the game put back.
 */
export function tutorialGame(opponent: Opponent): GameSliceState {
  return {...dealtGame(freshPhaseFor("Casual")), opponent: {...opponent, name: "Human", playerSide: "cho"}};
}
