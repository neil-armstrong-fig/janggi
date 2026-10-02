import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";

/** The ledger a merged result leaves the device with: each style's id and time, and what was deleted. */
export function ledgerOf(data: SyncData): SyncLedgerSliceState {
  return {
    boards: stampsByName(data.styles.boards),
    pieceSets: stampsByName(data.styles.pieceSets),
    deleted: data.styles.deleted,
    preferencesAt: data.preferences.at,
    ratingsResetAt: data.ratings.resetAt,
  };
}

function stampsByName(styles: readonly StampedStyle<CustomStyle>[]): Record<string, StyleStamp> {
  return Object.fromEntries(styles.map(({style, id, at}) => [style.name, {id, at}]));
}
