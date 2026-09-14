/**
 * The strengths the bot is offered at, as Elo ratings.
 *
 * **These are nominal.** Fairy-Stockfish turns an Elo into a skill level through a curve calibrated
 * on chess (CCRL, 60+0.6), and nobody has calibrated it for janggi — so "Bot 1400" names a rung on
 * a ladder that climbs, not a promise about any rating list. `docs/bot.md` has the detail.
 *
 * The bottom rung sits above the engine's own floor of 500 and the top one is its ceiling, 2850.
 */
export const BOT_ELOS = [800, 1000, 1200, 1400, 1600, 1900, 2200, 2850] as const;

export type BotElo = (typeof BOT_ELOS)[number];

export const DEFAULT_BOT_ELO: BotElo = 1200;
