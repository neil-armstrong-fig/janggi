import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {openBotElos} from "@src/redux/progress/unlocks/OpenBotElos";

/**
 * Why a strength of bot may not be played yet, or undefined where it may — said as the rung directly
 * beneath it, which is the one that opens it.
 *
 * **Each rung names its own predecessor, not the next game to go and play.** A player reading the list
 * sees 1000 wants 800 beaten, 1200 wants 1000, 1400 wants 1200, and has the cascade without being told
 * it; naming the one strength they could play next against every locked rung said the same thing eight
 * times and hid the shape of the ladder.
 *
 * The format is named because the ladders are kept apart: a player who has climbed in casual games meets
 * the bottom rung again the first time they play a scored one.
 */
export function lockBehindBot(
  elo: BotElo,
  beaten: BeatenLadders,
  format: MatchFormat,
  choice: SideChoiceName,
): string | undefined {
  if (openBotElos(beaten, format, choice).includes(elo)) return undefined;

  // The bottom rung is open to everybody, so a locked strength always has one beneath it.
  const beneath = BOT_ELOS[BOT_ELOS.indexOf(elo) - 1];
  if (beneath === undefined) return undefined;

  const army = choice === "Random" ? "with both armies" : `as ${choice}`;

  return `beat ${beneath} ${army} in a ${format.toLowerCase()} game first`;
}
