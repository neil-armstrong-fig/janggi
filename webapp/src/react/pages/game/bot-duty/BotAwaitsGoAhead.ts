import type {GoAheadQuestion} from "@src/react/pages/game/bot-duty/types/GoAheadQuestion";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";

/**
 * Whether the bot is holding the game's first move until the player lets it start.
 *
 * Against the bot as cho the first move is the bot's, and a game against the bot is rated from its
 * first move: the settings lock, and walking away counts as a loss. A bot that played the moment it
 * was on move would make choosing Han the same as starting a game, and a player still looking through
 * the settings would find them locked and their next new game counted against them. So it waits, under
 * a button over the board, for `botLetOpen`.
 *
 * Only the first move is held. A scored game's laying out is not — it locks nothing and rates nothing
 * — and once anything has been played the game is under way and the bot answers as it always has.
 *
 * Asked beside `botDutyFor` rather than folded into it, because the game is still waiting on the bot's
 * army: the board stays closed and Pass and Bikjang stay off. What it changes is only whether the
 * engine is asked, and so whether the herald says the bot is thinking.
 */
export function botAwaitsGoAhead({played, phase, opponent, botMayOpen}: GoAheadQuestion): boolean {
  if (botMayOpen || played.past.length > 0) return false;

  return botDutyFor(played, phase, opponent)?.kind === "play";
}
