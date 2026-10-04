import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";

/**
 * A million XP, and every bot beaten with both armies in both formats.
 *
 * A fresh device has only the first board, the first few piece sets and the weakest bot, and earning the rest is far
 * deeper than a spec can tap. So every spec starts with everything unlocked, set through the app's debug door
 * (`janggi.debug`) — and a spec about the locks themselves puts the player back wherever it is about first.
 * `src/tests/progress/` is where those are.
 */
export const EVERYTHING_UNLOCKED = {
  xp: 1_000_000,
  beaten: {Casual: {cho: BOT_ELOS, han: BOT_ELOS}, Scored: {cho: BOT_ELOS, han: BOT_ELOS}},
};
