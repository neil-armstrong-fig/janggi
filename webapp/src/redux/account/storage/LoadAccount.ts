import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {ACCOUNT_STATUSES} from "@src/redux/account/types/AccountStatus";
import {ACCOUNT_STORAGE_KEY} from "@src/redux/account/storage/AccountStorageKey";
import type {AccountSliceState} from "@src/redux/account/types/AccountSliceState";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * Whether the device was signed in when it was last open, and what the player was called: how well syncing went is
 * not carried across a reload, since the page asks the server again and finds out. A name only comes back for a
 * player who is not signed out, and only if it still checks out as a name.
 *
 * Anything that does not check out is signed out, which is also what a device that never signed in reads as —
 * so a broken record can only ever mean the player has to press the button again.
 */
export function loadAccount(storage: Pick<Storage, "getItem"> | undefined): AccountSliceState {
  const stored = readJson(storage, ACCOUNT_STORAGE_KEY);
  const kept = isObject(stored) ? stored : {};
  const status = isAmong(ACCOUNT_STATUSES, kept["status"]) ? kept["status"] : "signed-out";
  const name = kept["displayName"];

  return {
    status,
    sync: "idle",
    displayName: status !== "signed-out" && typeof name === "string" ? cleanedDisplayName(name) : undefined,
  };
}
