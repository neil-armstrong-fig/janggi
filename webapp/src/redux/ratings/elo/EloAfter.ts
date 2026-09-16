import type {GameResult} from "@src/redux/ratings/types/GameResult";

/** One finished game, from the rating's point of view: where it stood, how settled it is, and how it went. */
export interface EloChange {
  readonly elo: number;
  readonly gamesPlayed: number;
  readonly opponentElo: number;
  readonly result: GameResult;
}

/**
 * A rating after one game, by the standard Elo formula against the bot's nominal rating.
 *
 * The bot's number is the rung it was set to, not a measured strength (`BotElo` says why), so the
 * player's rating is really a place on that same ladder — which is all a local rating needs to be.
 *
 * A new rating moves fast and a settled one slowly: K is 40 for the first thirty games and 20 after,
 * the shape FIDE uses. Rounded to a whole point, as ratings are shown.
 */
export function eloAfter({elo, gamesPlayed, opponentElo, result}: EloChange): number {
  const expected = 1 / (1 + 10 ** ((opponentElo - elo) / 400));
  const k = gamesPlayed < SETTLED_AFTER_GAMES ? NEW_K : SETTLED_K;

  return Math.round(elo + k * (SCORES[result] - expected));
}

const SCORES: Record<GameResult, number> = {won: 1, drawn: 0.5, lost: 0};

const SETTLED_AFTER_GAMES = 30;

const NEW_K = 40;

const SETTLED_K = 20;
