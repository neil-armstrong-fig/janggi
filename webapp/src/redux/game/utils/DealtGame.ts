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
 *
 * The match format is fixed at casual here, which is the game every online implementation plays
 * and the one `docs/rules.md` §6.2 calls the casual reading. It is the engine's to vary and not
 * yet the player's: a picker hands it in when the setting reaches the screen, and it arrives the
 * same way a setup does, by dealing a new game rather than changing one under way.
 */
export function dealtGame(hanSetup: Setup, choSetup: Setup): GameSliceState {
  return {
    played: playedGameFrom(newGame(hanSetup, choSetup, "Casual")),
    hanSetup,
    choSetup,
  };
}
