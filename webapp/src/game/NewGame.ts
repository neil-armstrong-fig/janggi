import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Setup} from "@src/game/setups/types/Setup";
import {startingPieces} from "@src/game/setups/utils/StartingPieces";

/**
 * A game about to start, from the arrangement each player chose.
 *
 * The two setups are separate arguments because the two players genuinely choose separately — Han
 * lays out first and may not revise, then Cho answers and moves first. See `docs/opening-setups.md`
 * §4 for the rule and `docs/rules.md` §3 for what Cho pays for the privilege.
 *
 * The format is asked for rather than defaulted. Janggi's two endgame rules differ between the
 * casual and scored readings, and defaulting would be exactly the silent pick `docs/rules.md` §6.2
 * set out to avoid — so every game says which of the two it is.
 */
export function newGame(hanSetup: Setup, choSetup: Setup, format: MatchFormat): GameState {
  return {
    pieces: startingPieces(hanSetup, choSetup),
    sideToMove: "cho",
    format,
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}
