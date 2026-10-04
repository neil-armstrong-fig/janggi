import type {GameState} from "@janggi/engine/types/GameState";
import type {Outcome} from "@janggi/engine/types/Outcome";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {endsAGameByRepetition} from "@janggi/engine/repetition/EndsAGameByRepetition";
import {isCheckmate} from "@janggi/engine/check/IsCheckmate";
import {opponentOf} from "@janggi/engine/utils/OpponentOf";
import {scoreFor} from "@janggi/engine/scoring/ScoreFor";

/**
 * Whether the game is over, and if it is, how.
 *
 * Derived rather than stored, the way `isInCheck` is: a result is a fact about the position and the
 * turns rested to reach it, not a second thing to keep in step with them. `GameState` therefore
 * carries no result field.
 *
 * The order matters. Checkmate is asked first because it outranks everything else — 완승 is a
 * complete win and nothing about the material can take it away. A repetition is asked before the
 * rest, since it is a fact of the position and not something anyone did.
 */
export function outcomeOf(state: GameState): Outcome {
  if (isCheckmate(state, state.sideToMove)) return {kind: "checkmate", winner: opponentOf(state.sideToMove)};

  if (endsAGameByRepetition(state)) return stoppedByRepetition(state);

  if (state.drawAgreed) return {kind: "agreement"};

  if (state.bikjangCalled) return calledBikjang(state);

  if (state.consecutivePasses >= PASSES_THAT_STOP_A_GAME) return decidedOnPoints(state);

  return {kind: "undecided"};
}

/**
 * What a game stopped by a repetition comes to, which is the same split a called bikjang makes: a
 * casual game draws — 친선 ends a repeat by agreement — and a scored game has no draw, so it stops and
 * counts the points. See `docs/rules.md` §6.4.
 */
function stoppedByRepetition(state: GameState): Outcome {
  if (state.format === "Casual") {
    return {kind: "repetition"};
  }

  return decidedOnPoints(state);
}

/**
 * What a called bikjang comes to, which is the one place the two match formats end a game
 * differently. Casually it is the draw every English source describes; under the KJA's scored
 * format there is no draw to reach — 대한장기연맹 abolished it outright in 2020 — so the same call
 * settles on points. See `docs/rules.md` §6.2.
 */
function calledBikjang(state: GameState): Outcome {
  if (state.format === "Casual") {
    return {kind: "bikjang"};
  }

  return decidedOnPoints(state);
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
