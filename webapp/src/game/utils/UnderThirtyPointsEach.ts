import type {GameState} from "@src/game/types/GameState";
import {materialFor} from "@src/game/MaterialFor";

/**
 * Whether both armies have fallen under thirty points.
 *
 * 대한장기협회's 대국규정 puts the same threshold on both of its endgame clauses — a bikjang may
 * only be called below it, and a position may only be repeated below it — so it is one function
 * rather than two constants that would drift. See `docs/rules.md` §6.2 and §6.4.
 *
 * The **piece score**, with no 덤 in it: "기물의 총 점수가 각각 30점 미만일 때". That is why this
 * asks `materialFor` rather than `scoreFor` — the 덤 is what a game is won on, not what an endgame
 * is recognised by.
 */
export function underThirtyPointsEach(state: GameState): boolean {
  return materialFor(state, "cho") < ENDGAME_THRESHOLD && materialFor(state, "han") < ENDGAME_THRESHOLD;
}

const ENDGAME_THRESHOLD = 30;
