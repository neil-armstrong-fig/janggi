import type {AppStartListening} from "@src/redux/account/listening/AppStartListening";
import {preferencesStamped, ratingsResetStamped, stylesStamped} from "@src/redux/account/ledger/SyncLedgerSlice";
import {haveSyncedPreferencesChanged} from "@src/redux/preferences/synced/HaveSyncedPreferencesChanged";
import {recordReset} from "@src/redux/ratings/RatingsSlice";
import {styleStampsAfter} from "@src/redux/account/ledger/stamping/StyleStampsAfter";
import {syncMerged} from "@src/redux/account/actions/SyncMerged";

/**
 * Notes when the player changes something the server keeps, in the ledger — always, signed in or not, so a change
 * made before the player signs in counts when they do.
 *
 * Not for a merge. What `syncMerged` leaves behind came from the server with its own times, and stamping it with
 * this device's clock would make everything in it look as if it had just been chosen here.
 *
 * Reducers cannot read a clock or make an id, which is why this is a listener and the ledger's reducers are only
 * told what to keep.
 */
export function stampChanges(startListening: AppStartListening): void {
  startListening({
    predicate: (action, current, previous) => {
      return !syncMerged.match(action) && current.customStyles !== previous.customStyles;
    },
    effect: (_action, api) => {
      api.dispatch(
        stylesStamped(
          styleStampsAfter(
            {
              previous: api.getOriginalState().customStyles,
              next: api.getState().customStyles,
              ledger: api.getState().syncLedger,
            },
            {now: Date.now(), newId: () => crypto.randomUUID()},
          ),
        ),
      );
    },
  });

  startListening({
    predicate: (action, current, previous) => {
      return !syncMerged.match(action) && haveSyncedPreferencesChanged(previous.preferences, current.preferences);
    },
    effect: (_action, api) => {
      api.dispatch(preferencesStamped(Date.now()));
    },
  });

  startListening({
    actionCreator: recordReset,
    effect: (_action, api) => {
      api.dispatch(ratingsResetStamped(new Date().toISOString()));
    },
  });
}
