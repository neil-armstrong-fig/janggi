import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";

/** One of the player's own styles with what the sync knows about it. */
export interface StampedStyle<Style extends CustomStyle> extends StyleStamp {
  readonly style: Style;
}
