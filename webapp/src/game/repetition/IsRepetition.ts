import type {GameState} from "@src/game/types/GameState";
import {standingOf} from "@src/game/utils/StandingOf";

/**
 * Whether the game now stands, for the third time, in a position it has stood in before — "동일한
 * 수를 3회 이상 반복할 수 없다", 대한장기협회's 대국규정. See `docs/rules.md` §6.4.
 *
 * **It reports; it does not adjudicate.** Clause ② — "반복수를 악용하여 이득을 취할 수 없다" — is a
 * judgement about intent, and who is at fault stays a referee's call. So this carries no exemption
 * either: whether a repetition is *allowed* is `underThirtyPointsEach`, asked where a move is
 * refused rather than here, so that this stays the plain question a UI can also put on screen.
 *
 * `state.seen` holds what the game has left behind, so a position standing for the third time is
 * one whose standing is already in there twice.
 */
export function isRepetition(state: GameState): boolean {
  if (state.seen.length < FEWEST_POSITIONS_A_THIRD_STANDING_NEEDS) return false;

  const standing = standingOf(state);

  return state.seen.filter(before => before === standing).length >= TIMES_IT_MUST_HAVE_STOOD_BEFORE;
}

/** "3회 이상" — three times or more, so twice already behind it and this one makes three. */
const TIMES_IT_MUST_HAVE_STOOD_BEFORE = 2;

/**
 * A position cannot come round in fewer than four plies — every piece would have to be put back,
 * and the turn handed over twice — so a third standing needs two such circuits behind it. Below
 * that there is nothing to find, and skipping the check is what keeps an opening from paying to
 * build a standing it could not possibly have seen before.
 */
const FEWEST_POSITIONS_A_THIRD_STANDING_NEEDS = 8;
