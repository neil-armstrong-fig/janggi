import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";
import type {RootState} from "@src/redux/Store";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";

/**
 * Everything of the player's that the server keeps, as the device holds it now.
 *
 * A style the ledger has no stamp for — none should be, `createStore` catches the ledger up — is given an id of its
 * own name and the beginning of time, so it can still be sent and is the oldest thing in any settlement.
 */
export function syncDataOf(state: RootState): SyncData {
  return {
    progress: state.progress,
    styles: {
      boards: stamped(state.customStyles.boards, state.syncLedger.boards),
      pieceSets: stamped(state.customStyles.pieceSets, state.syncLedger.pieceSets),
      deleted: state.syncLedger.deleted,
    },
    ratings: {byFormat: state.ratings.byFormat, resetAt: state.syncLedger.ratingsResetAt},
    preferences: {value: syncedPreferencesOf(state.preferences), at: state.syncLedger.preferencesAt},
  };
}

function stamped<Style extends CustomStyle>(
  styles: readonly Style[],
  stamps: Readonly<Record<string, StyleStamp>>,
): readonly StampedStyle<Style>[] {
  return styles.map(style => ({...(stamps[style.name] ?? {id: `unstamped:${style.name}`, at: 0}), style}));
}
