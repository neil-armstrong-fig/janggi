import type {GameSliceState} from "@src/redux/slices/game/types/GameSliceState";
import type {Opponent} from "@src/redux/slices/game/types/Opponent";
import {dealtGame} from "@src/redux/slices/game/dealing/DealtGame";
import {freshPhaseFor} from "@src/redux/slices/game/dealing/FreshPhaseFor";

/** A fresh casual teaching board: Cho to move, no bot, ratings or automatic replies. */
export function practiceGame(opponent: Opponent): GameSliceState {
  return {...dealtGame(freshPhaseFor("Casual")), opponent: {...opponent, name: "Human", playerSide: "cho"}};
}
