import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import {isAmong} from "@src/redux/untrusted/IsAmong";

/** The XP a piece set takes to wear. As with a board style, only a built-in has a price. */
export function pieceSetPrice(name: string): number {
  return isAmong(PIECE_SET_NAMES, name) ? UNLOCK_PRICES.pieceSets[name] : 0;
}
