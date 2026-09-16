import {DEFAULT_BOT_ELO} from "@janggi/shared/janggi/settings/BotElo";
import {DEFAULT_MATCH_FORMAT} from "@janggi/shared/janggi/settings/MatchFormat";
import {DEFAULT_OPPONENT} from "@janggi/shared/janggi/settings/OpponentName";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";

/**
 * The game a player meets the first time they open the app: casual, against the bot, dealt on the
 * common arrangement. What the slice starts from, and what a game kept on the device falls back to
 * when it cannot be trusted.
 *
 * The player opens as Cho against the weakest bot playing Han, and deliberately not on a random army:
 * the first game is the same every time, and nobody waits for the bot before they have touched anything.
 */
export function firstGame(): GameSliceState {
  return {
    ...dealtGame(freshPhaseFor(DEFAULT_MATCH_FORMAT)),
    opponent: {name: DEFAULT_OPPONENT, botElo: DEFAULT_BOT_ELO, sideChoice: "Cho", playerSide: "cho"},
  };
}
