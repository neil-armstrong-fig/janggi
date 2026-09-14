import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";

/**
 * How long the engine may think per move at each rung, in milliseconds.
 *
 * `UCI_Elo` is what weakens the bot — it makes the engine choose worse moves on purpose — and was
 * calibrated at a real clock, so a bot given no time at all would play below its label. Enough time
 * to search, then, but never so much that a player on a phone sits waiting: the ceiling is a few
 * seconds even at the top.
 */
export const MOVE_TIMES_MS: Record<BotElo, number> = {
  800: 250,
  1000: 300,
  1200: 400,
  1400: 500,
  1600: 700,
  1900: 1_000,
  2200: 1_500,
  2850: 2_500,
};
