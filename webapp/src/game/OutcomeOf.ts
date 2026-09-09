import type {GameState} from "@src/game/types/GameState";
import type {Outcome} from "@src/game/types/Outcome";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isCheckmate} from "@src/game/IsCheckmate";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {scoreFor} from "@src/game/ScoreFor";

/**
 * Whether the game is over, and if it is, how.
 *
 * Derived rather than stored, the way `isInCheck` is: a result is a fact about the position and the
 * turns rested to reach it, not a second thing to keep in step with them. `GameState` therefore
 * carries no result field.
 *
 * The order matters. Checkmate is asked first because it outranks a points win — 완승 is a complete
 * win and nothing about the material can take it away.
 */
export function outcomeOf(state: GameState): Outcome {
  if (isCheckmate(state, state.sideToMove)) return {kind: "checkmate", winner: opponentOf(state.sideToMove)};

  if (state.consecutivePasses >= PASSES_THAT_STOP_A_GAME) return decidedOnPoints(state);

  return {kind: "undecided"};
}

/**
 * Who was ahead when the two players stopped. Han's 덤 is a half point, so the two scores can never
 * be equal and there is no third case to answer for.
 */
function decidedOnPoints(state: GameState): Outcome {
  const scores: Record<Side, number> = {cho: scoreFor(state, "cho"), han: scoreFor(state, "han")};

  return {kind: "pointsWin", winner: scores.cho > scores.han ? "cho" : "han", scores};
}

/**
 * "서로 연속으로 한수 쉼을 할 경우 대국종료 후 점수로 승패 결정" — 대한장기연맹's 2022 revision,
 * `docs/rules.md` §6.3. One pass is one player with nothing to play; two in a row is both of them
 * agreeing there is nothing left to play for.
 */
const PASSES_THAT_STOP_A_GAME = 2;
