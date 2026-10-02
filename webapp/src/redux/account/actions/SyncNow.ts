import type {Action} from "@reduxjs/toolkit";
import type {AppDispatch, RootState} from "@src/redux/Store";
import type {AppThunk} from "@src/redux/AppThunk";
import type {ServerData} from "@src/redux/account/syncing/types/ServerData";
import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";
import {SessionEnded} from "@src/redux/account/syncing/SessionEnded";
import {TooLargeToSync} from "@src/redux/account/syncing/TooLargeToSync";
import {callServer} from "@src/redux/account/server/CallServer";
import {mergedSyncData} from "@src/redux/account/merging/MergedSyncData";
import {serverDataFrom} from "@src/redux/account/syncing/ServerDataFrom";
import {signedOut, syncFailed, syncSucceeded, syncTooLarge} from "@src/redux/account/AccountSlice";
import {syncDataFrom} from "@src/redux/account/data/SyncDataFrom";
import {syncDataOf} from "@src/redux/account/data/SyncDataOf";
import {syncDataText} from "@src/redux/account/data/SyncDataText";
import {syncMerged} from "@src/redux/account/actions/SyncMerged";

/** Tries to write a second time after the server says another device wrote in between; no more than that. */
const ATTEMPTS = 2;

/**
 * Brings this device and the server level: reads what the server holds, merges it into what the device holds,
 * and writes the result back if the server does not have it yet.
 *
 * **The device is the source of truth, and this is best effort.** Whatever goes wrong — offline, the free
 * plan's daily cap, a 5xx — ends in `syncFailed`, which the settings show as paused and nothing else notices;
 * the next change tries again. Only the server saying it no longer knows the player signs them out.
 *
 * Whether there is anything to do is decided by comparing the canonical text of each side (`syncDataText`), so a
 * device that holds nothing the server lacks, and a server that holds nothing the device lacks, write nothing:
 * this is what runs after a merge changed the store, and a write there would only start another round.
 */
export function syncNow(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    try {
      await bringLevel(dispatch, getState, ATTEMPTS);
      dispatch(syncSucceeded());
    } catch (error) {
      dispatch(failureAfter(error));
    }
  };
}

async function bringLevel(dispatch: AppDispatch, getState: () => RootState, attempts: number): Promise<void> {
  const remote = await readServerData();
  const theirs = remote.blob === null ? undefined : syncDataFrom(remote.blob);

  if (theirs) {
    const local = syncDataOf(getState());
    const merged = mergedSyncData(local, theirs);

    if (syncDataText(merged) !== syncDataText(local)) dispatch(syncMerged(merged));
  }

  const blob = syncDataText(syncDataOf(getState()));
  if (blob === remote.blob) return;
  if (blob.length > MAX_SYNCED_DATA_LENGTH) throw new TooLargeToSync();

  const written = await callServer("/api/data", {
    method: "PUT",
    headers: {"Content-Type": "application/json", "If-Match": String(remote.version)},
    body: JSON.stringify({blob}),
  });

  if (written.status === 409 && attempts > 1) return bringLevel(dispatch, getState, attempts - 1);
  if (written.status === 401) throw new SessionEnded();
  if (written.status === 413) throw new TooLargeToSync();
  if (!written.ok) throw new Error(`The server refused the data: ${written.status}`);
}

/** What a sync that failed says about the player: signed out where the server no longer knows them, too large where it would never be kept, and otherwise only paused. */
function failureAfter(error: unknown): Action {
  if (error instanceof SessionEnded) return signedOut();
  if (error instanceof TooLargeToSync) return syncTooLarge();

  return syncFailed();
}

async function readServerData(): Promise<ServerData> {
  const response = await callServer("/api/data");

  if (response.status === 401) throw new SessionEnded();
  if (!response.ok) throw new Error(`The server would not give the data: ${response.status}`);

  const data = serverDataFrom(await response.json());
  if (!data) throw new Error("The server's data was not in the shape it sends.");

  return data;
}
