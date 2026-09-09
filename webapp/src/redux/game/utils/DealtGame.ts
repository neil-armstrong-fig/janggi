import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Setup} from "@src/game/setups/types/Setup";
import {newGame} from "@src/game/NewGame";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

/**
 * A game about to start, and the slice around it.
 *
 * Every way a game begins comes through here — the first one, choosing either army's setup, and
 * starting again — because a setup is *dealt*, not applied: it decides where the pieces stand
 * before anyone moves, so changing one cannot be folded into a game already under way. Keeping the
 * three in one place is what stops one of them leaving a record of the game before it behind, which
 * would offer a player the chance to take back a move belonging to a game that no longer exists.
 */
export function dealtGame(hanSetup: Setup, choSetup: Setup): GameSliceState {
  return {
    played: playedGameFrom(newGame(hanSetup, choSetup)),
    hanSetup,
    choSetup,
  };
}
