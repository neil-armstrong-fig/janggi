import type {CustomStyle} from "@src/redux/slices/custom-styles/types/CustomStyle";
import type {DeletedStyle} from "@src/redux/slices/account/ledger/types/DeletedStyle";
import type {Deletions} from "@src/redux/slices/account/merging/merged-styles/types/Deletions";
import type {StampedStyle} from "@src/redux/slices/account/data/types/StampedStyle";

/** One kind of the player's own styles on two devices, with what has been deleted and the names no style may take. */
export interface StylesToMerge<Style extends CustomStyle> {
  readonly kind: DeletedStyle["kind"];
  readonly local: readonly StampedStyle<Style>[];
  readonly remote: readonly StampedStyle<Style>[];
  readonly deletions: Deletions;
  readonly builtIns: readonly string[];
}
