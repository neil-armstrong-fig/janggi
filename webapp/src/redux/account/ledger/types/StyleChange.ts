import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";

/** The player's own styles going from one list to another, and what the ledger said of them before. */
export interface StyleChange {
  readonly previous: CustomStylesSliceState;
  readonly next: CustomStylesSliceState;
  readonly ledger: SyncLedgerSliceState;
}
