import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Setup} from "@src/game/setups/types/Setup";
import {newGame} from "@src/game/NewGame";

/**
 * A game about to start, and the slice around it.
 *
 * Every way a game begins comes through here — the first one, choosing either army's setup, and
 * starting again — because a setup is *dealt*, not applied: it decides where the pieces stand
 * before anyone moves, so changing one cannot be folded into a game already under way. Keeping the
 * three in one place is what stops one of them forgetting to reset `movesPlayed` and quietly
 * leaving the pickers locked on a fresh board.
 */
export function dealtGame(hanSetup: Setup, choSetup: Setup): GameSliceState {
  return {
    game: newGame(hanSetup, choSetup),
    hanSetup,
    choSetup,
    movesPlayed: 0,
  };
}
