import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";

/** The player's own styles as the sync holds them, with the ones they have deleted. */
export interface SyncedStyles {
  readonly boards: readonly StampedStyle<BoardStyle>[];
  readonly pieceSets: readonly StampedStyle<PieceSetStyle>[];
  readonly deleted: readonly DeletedStyle[];
}
