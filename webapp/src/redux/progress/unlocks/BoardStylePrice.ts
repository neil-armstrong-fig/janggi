import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import {isAmong} from "@src/redux/untrusted/IsAmong";

/**
 * The XP a board style takes to wear. A style of the player's own costs nothing — they made it, or were
 * given it — so only a built-in has a price.
 */
export function boardStylePrice(name: string): number {
  return isAmong(BOARD_STYLE_NAMES, name) ? UNLOCK_PRICES.boardStyles[name] : 0;
}
