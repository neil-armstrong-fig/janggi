import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Setup} from "@src/game/setups/types/Setup";
import {newGame} from "@src/game/NewGame";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

/**
 * A game about to start, and the slice around it.
 *
 * Every way a game begins comes through here — the first one, choosing either army's setup, picking
 * the match format, and starting again — because all of those are *dealt*, not applied. A setup
 * decides where the pieces stand before anyone moves and a format decides which game those pieces
 * are playing, so changing either cannot be folded into a game already under way. Keeping them
 * in one place is what stops one of them leaving a record of the game before it behind, which
 * would offer a player the chance to take back a move belonging to a game that no longer exists.
 */
export function dealtGame(hanSetup: Setup, choSetup: Setup, format: MatchFormat): GameSliceState {
  return {
    played: playedGameFrom(newGame(hanSetup, choSetup, format)),
    hanSetup,
    choSetup,
    format,
  };
}
