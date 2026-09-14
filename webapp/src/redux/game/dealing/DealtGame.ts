import type {DealtBoard} from "@src/redux/game/dealing/types/DealtBoard";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {boardShownFor} from "@src/redux/game/dealing/board-shown-for/BoardShownFor";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

/**
 * A game about to start, and the slice around it.
 *
 * Every way a board changes before play comes through here — the first one, either army laying out,
 * picking the match format, and starting again — because all of those are *dealt*, not applied. An
 * arrangement decides where the pieces stand before anyone moves and a format decides which game
 * those pieces are playing, so changing either cannot be folded into a game already under way.
 * Keeping them in one place is what stops one of them leaving a record of the game before it behind,
 * which would offer a player the chance to take back a move belonging to a game that no longer
 * exists.
 *
 * It takes the whole phase rather than its three parts, so a half-finished one — a scored game where
 * Han has laid out and Cho has not — is dealt exactly like a finished one and nothing here has to
 * know the difference. `boardShownFor` is what decides what such a board looks like.
 *
 * Who the opponent is rides beside what is dealt rather than in it — the slice carries it across.
 */
export function dealtGame(phase: SetupPhase): DealtBoard {
  return {played: playedGameFrom(boardShownFor(phase)), phase};
}
