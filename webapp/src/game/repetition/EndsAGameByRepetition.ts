import type {GameState} from "@src/game/types/GameState";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";

/**
 * Whether the game now stands, for the third time, in a position where nothing is left to refuse the
 * repeat — so the repeat is what ends it. See `docs/rules.md` §6.4.
 *
 * Above thirty points a side the third standing is not reached: `movesFrom` does not offer the move
 * that would make it, and a player has to play something else. Below, "동일수(반복장군 포함)를 반복할
 * 수 있다" — the same move may be repeated, perpetual check included — and with nothing refusing it a
 * game where neither army can make progress would go round for ever. Friendly janggi ends that by
 * agreement, and a tournament stops the game and counts the points, which is the split `outcomeOf`
 * makes between the two formats.
 *
 * `isRepetition` reports and this decides, the way `underThirtyPointsEach` is asked by `movesFrom`
 * rather than by `isRepetition`: what it means to repeat, and what a repeat is worth, stay separate
 * questions.
 */
export function endsAGameByRepetition(state: GameState): boolean {
  return underThirtyPointsEach(state) && isRepetition(state);
}
