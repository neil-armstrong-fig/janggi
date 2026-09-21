import type {GameSliceState} from "@src/redux/game/types/GameSliceState";

/**
 * The game once the draw on offer has been turned down. The refusal is kept, not just forgotten, so
 * that a player who offered to the bot is told it said no rather than left to wonder; the next thing
 * that happens in the game takes it away.
 *
 * With no draw on offer, or one already declined, there is nothing to turn down and the state comes
 * back as it was — a bot's answer landing late is no reason to change anything.
 */
export function declinedADraw(state: GameSliceState): GameSliceState {
  const {drawOffer} = state;
  if (!drawOffer || drawOffer.declined) return state;

  return {...state, drawOffer: {...drawOffer, declined: true}};
}
