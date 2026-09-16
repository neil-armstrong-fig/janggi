import type {GameResult} from "@src/redux/ratings/types/GameResult";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";

/**
 * The XP one decided game against the bot is worth: something for seeing it through, more for winning
 * it, and more again for playing it scored, the stricter of janggi's two games.
 *
 * A game walked away from is worth nothing and never reaches here — otherwise dealing a game and
 * abandoning it would be the quickest way up.
 */
export function xpFor(format: MatchFormat, result: GameResult): number {
  return FOR_FINISHING + (result === "won" ? FOR_WINNING : 0) + (format === "Scored" ? FOR_SCORED : 0);
}

const FOR_FINISHING = 10;
const FOR_WINNING = 20;
const FOR_SCORED = 10;
