import type {GameState} from "@src/game/types/GameState";
import {isInCheck} from "@src/game/IsInCheck";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether the army to move may rest the turn — 한수쉼, lifting the general off the board and setting
 * it back down.
 *
 * Unrestricted otherwise: en.wikipedia and pychess both say there is no limit on when or how often
 * a player may pass, and the KJA's "자기 차례에 둘 것이 없어" — *having nothing to play* — describes
 * the gesture rather than gating it. See `docs/rules.md` §6.3.
 *
 * **A check has to be answered.** That rule is in no source and is derived: were a player allowed
 * to rest out of check, a mated general would simply sit still and 외통 could not exist at all.
 *
 * This stands to `pass` as `movesFrom` stands to `applyMove` — the question a board asks in order to
 * offer the move, where `pass` is the move being made.
 */
export function canPass(state: GameState): boolean {
  return outcomeOf(state).kind === "undecided" && !isInCheck(state, state.sideToMove);
}
