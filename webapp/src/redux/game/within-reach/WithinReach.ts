import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {dealtAgainst} from "@src/redux/game/dealing/DealtAgainst";
import {openBotElos} from "@src/redux/progress/unlocks/OpenBotElos";

/**
 * The game as it stands, unless the bot it is set against is one the player's progress does not reach —
 * which a save with less in it can bring about, loaded over a device that had climbed further, and which
 * the app also asks on every load.
 *
 * A game against the bot already under way is left for the player to finish: they chose that bot when it
 * was theirs to choose, and taking the board away mid-game would be a strange way to tell them otherwise.
 * One not yet begun is dealt again against the strongest bot they may face with the army they chose.
 * Between two people nothing is dealt at all — the bot's strength is only moved down for whenever the bot
 * is next chosen, and their game is none of this rule's business.
 */
export function withinReach(state: GameSliceState, beaten: BeatenLadders): GameSliceState {
  const open = openBotElos(beaten, state.phase.format, state.opponent.sideChoice);
  const strongest = open.at(-1);
  if (strongest === undefined || open.includes(state.opponent.botElo)) return state;

  const opponent = {...state.opponent, botElo: strongest};
  if (state.opponent.name === "Human") return {...state, opponent};
  if (state.played.past.length > 0) return state;

  return dealtAgainst(state, opponent);
}
