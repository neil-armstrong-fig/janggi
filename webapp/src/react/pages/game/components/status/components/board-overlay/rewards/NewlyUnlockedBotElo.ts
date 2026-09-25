import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {openBotElos} from "@src/redux/progress/unlocks/OpenBotElos";

interface Game {
  readonly status: GameStatus;
  readonly opponent: Opponent;
  readonly format: MatchFormat;
  /** What the player has beaten now, this game's win included. */
  readonly beaten: BeatenLadders;
}

/**
 * The strength of bot the player's win has just opened and not yet faced — the rung directly above the one
 * beaten — or undefined where the game was not a win against the bot, the strongest bot was beaten, or the
 * rung above was open and beaten before.
 *
 * Worked out from what is beaten now rather than stored beside the result, as `rewardFor` is: by the time
 * the result is announced the win is already on the ladder, so the rung above being open and unbeaten is
 * the win having opened it.
 */
export function newlyUnlockedBotElo({status, opponent, format, beaten}: Game): BotElo | undefined {
  if (opponent.name !== "Bot") return undefined;
  if ((status.kind !== "won" && status.kind !== "wonOnPoints") || status.by !== opponent.playerSide) return undefined;

  const next = BOT_ELOS[BOT_ELOS.indexOf(opponent.botElo) + 1];
  if (next === undefined) return undefined;
  if (beaten[format][opponent.playerSide].includes(next)) return undefined;

  return openBotElos(beaten, format, opponent.sideChoice).includes(next) ? next : undefined;
}
