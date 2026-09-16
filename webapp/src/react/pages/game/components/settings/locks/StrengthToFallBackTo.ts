import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import {DEFAULT_BOT_ELO} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {openBotElos} from "@src/redux/progress/unlocks/OpenBotElos";

interface StrengthQuestion {
  readonly beaten: BeatenLadders;
  readonly format: MatchFormat;
  readonly choice: SideChoiceName;
  readonly botElo: BotElo;
}

/**
 * The strength to drop the bot to when a player chooses an army or a format the current strength is not
 * open on, or undefined where it is open and nothing need change.
 *
 * Dropped to the strongest bot open on the ladder being moved to, rather than locking the choice: neither
 * an army nor a format is a thing to be earned, and a player who wants the other game should not have to
 * find their way back out of a locked picker first.
 */
export function strengthToFallBackTo({beaten, format, choice, botElo}: StrengthQuestion): BotElo | undefined {
  const open = openBotElos(beaten, format, choice);

  return open.includes(botElo) ? undefined : (open.at(-1) ?? DEFAULT_BOT_ELO);
}
