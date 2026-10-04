import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {FRIEND_STORAGE_KEY} from "@src/redux/online/storage/FriendStorageKey";
import {isObject} from "@src/redux/untrusted/IsObject";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * A device with no stored code, or one that is not a code, has no room. One with a code has the player on their way back
 * to it, which `useFriendRoom` does once it knows they are signed in — the state is `idle` until the room says otherwise.
 */
export function loadFriend(storage: Pick<Storage, "getItem"> | undefined): FriendSliceState {
  const stored = readJson(storage, FRIEND_STORAGE_KEY);
  const code = isObject(stored) && typeof stored["code"] === "string" ? parseFriendCode(stored["code"]) : undefined;

  return noFriendGame(code);
}
