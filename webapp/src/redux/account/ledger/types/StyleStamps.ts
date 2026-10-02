import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";

/** What `stamping` works out about the player's own styles after a change to them. */
export interface StyleStamps {
  readonly boards: Readonly<Record<string, StyleStamp>>;
  readonly pieceSets: Readonly<Record<string, StyleStamp>>;
  readonly deleted: readonly DeletedStyle[];
}
