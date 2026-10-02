import type {AppStartListening} from "@src/redux/account/listening/AppStartListening";
import {haveSyncedPreferencesChanged} from "@src/redux/preferences/synced/HaveSyncedPreferencesChanged";
import {syncMerged} from "@src/redux/account/actions/SyncMerged";
import {syncNow} from "@src/redux/account/actions/SyncNow";
import {syncPending} from "@src/redux/account/AccountSlice";

/** Long enough that a run of changes — a game ending, XP then a bot beaten — is one write, not several. */
const QUIET_FOR_MS = 1500;

/**
 * Syncs once what the server keeps has stopped changing, for as long as the player is signed in.
 *
 * Compared by identity, as the store's writes to the device are, so a change to anything else — a move, which
 * sheet is open — never reaches the server. A signed-out player is never synced, whatever changes, and neither is
 * a change that was only the result of a sync: it is what the server already holds.
 *
 * `cancelActiveListeners` is the debounce: each change cancels the wait the last one started.
 */
export function keepInStep(startListening: AppStartListening): void {
  startListening({
    predicate: (action, current, previous) =>
      current.account.status === "signed-in" &&
      !syncMerged.match(action) &&
      (current.progress !== previous.progress ||
        current.customStyles !== previous.customStyles ||
        current.ratings.byFormat !== previous.ratings.byFormat ||
        haveSyncedPreferencesChanged(previous.preferences, current.preferences) ||
        current.syncLedger !== previous.syncLedger),
    effect: async (_action, api) => {
      api.cancelActiveListeners();
      api.dispatch(syncPending());

      await api.delay(QUIET_FOR_MS);
      await api.dispatch(syncNow());
    },
  });
}
