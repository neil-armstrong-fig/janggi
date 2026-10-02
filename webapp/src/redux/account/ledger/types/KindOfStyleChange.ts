import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";

/** One kind of the player's own styles going from one list to another, and what the ledger said of them before. */
export interface KindOfStyleChange {
  readonly kind: StyleKind;
  readonly previous: readonly CustomStyle[];
  readonly next: readonly CustomStyle[];
  readonly ledger: Readonly<Record<string, StyleStamp>>;
}
