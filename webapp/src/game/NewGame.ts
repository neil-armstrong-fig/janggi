import type {GameState} from "@src/game/types/GameState";
import type {Setup} from "@src/game/setups/types/Setup";
import {startingPieces} from "@src/game/setups/utils/StartingPieces";

/**
 * A game about to start, from the arrangement each player chose.
 *
 * The two setups are separate arguments because the two players genuinely choose separately — Han
 * lays out first and may not revise, then Cho answers and moves first. See `docs/opening-setups.md`
 * §4 for the rule and `docs/rules.md` §3 for what Cho pays for the privilege.
 */
export function newGame(hanSetup: Setup, choSetup: Setup): GameState {
  return {
    pieces: startingPieces(hanSetup, choSetup),
    sideToMove: "cho",
    consecutivePasses: 0,
  };
}
