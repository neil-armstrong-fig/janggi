import type {AppStore} from "@src/redux/Store";
import {stylesStamped} from "@src/redux/account/ledger/SyncLedgerSlice";
import {styleStampsAfter} from "@src/redux/account/ledger/stamping/StyleStampsAfter";

/**
 * Gives every style on the device a stamp, for styles that were there before there was a ledger or that the ledger
 * has otherwise fallen behind. They are given the beginning of time, there being nothing to say when they were made,
 * which makes them the oldest thing in any settlement and so the first to give way.
 *
 * Does nothing where the ledger is already right, so a device with no styles of its own is not written to.
 */
export function caughtUpLedger(store: AppStore): void {
  const {customStyles, syncLedger} = store.getState();
  const stamps = styleStampsAfter(
    {previous: customStyles, next: customStyles, ledger: syncLedger},
    {now: 0, newId: () => crypto.randomUUID()},
  );
  const unchanged =
    JSON.stringify([stamps.boards, stamps.pieceSets]) === JSON.stringify([syncLedger.boards, syncLedger.pieceSets]);

  if (!unchanged) store.dispatch(stylesStamped(stamps));
}
