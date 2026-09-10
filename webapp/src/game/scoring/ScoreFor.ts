import type {GameState} from "@src/game/types/GameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {materialFor} from "@src/game/scoring/MaterialFor";

/**
 * What one army is worth in a game decided on points: its pieces, and Han's 덤 on top.
 *
 * A new game stands at seventy-two against seventy-three and a half, which is the whole of what the
 * 덤 does — it is half a point rather than one or two so that no scored game can end level. See
 * `docs/rules.md` §6.5.
 */
export function scoreFor(state: GameState, side: Side): number {
  return materialFor(state, side) + (side === "han" ? DEOM : 0);
}

/**
 * 덤 (*deom*), the 1.5 points Han receives for Cho moving first and choosing its setup last.
 * 대한장기협회's 대국규정: "후수자(漢)는 선수자(楚)로부터 1.5점의 덤을 받는다."
 */
const DEOM = 1.5;
