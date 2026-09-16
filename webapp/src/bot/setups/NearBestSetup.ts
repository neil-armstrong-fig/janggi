import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupRating} from "@src/bot/setups/types/SetupRating";
import {TOURNAMENT_SETUPS} from "@src/bot/setups/TournamentSetups";

/**
 * Which setup to lay out from those the engine rated, picked by `roll` — a number in [0, 1), as
 * `Math.random` gives one.
 *
 * **Near the best, not simply the best.** Openings often come out a handful of centipawns apart, which
 * is noise in a quarter-second search rather than a real difference, and a bot that always took the top
 * one would answer the same layout the same way every game. So any setup within `NEAR_BEST_BY` of the
 * best may be picked, and one clearly better than the rest is still picked every time.
 *
 * Where nothing was rated — an engine that reported no score at all — any tournament setup will do.
 */
export function nearBestSetup(ratings: readonly SetupRating[], roll: number): Setup {
  const best = Math.max(...ratings.map(({score}) => score));
  const nearBest = ratings.filter(({score}) => score >= best - NEAR_BEST_BY).map(({setup}) => setup);
  const choices = nearBest.length > 0 ? nearBest : TOURNAMENT_SETUPS;

  return choices[Math.floor(roll * choices.length)] ?? DEFAULT_SETUP;
}

/** How far behind the best, in centipawns, a setup may be rated and still be picked — a fifth of a soldier. */
const NEAR_BEST_BY = 30;
