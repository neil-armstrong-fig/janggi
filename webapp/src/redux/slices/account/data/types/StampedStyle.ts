import type {CustomStyle} from "@src/redux/slices/custom-styles/types/CustomStyle";
import type {StyleStamp} from "@src/redux/slices/account/ledger/types/StyleStamp";

/** One of the player's own styles with what the sync knows about it. */
export interface StampedStyle<Style extends CustomStyle> extends StyleStamp {
  readonly style: Style;
}
