import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";

/** Whether the game on the board is the one with a friend, from the moment the room has dealt it to the moment the player leaves. */
export function inFriendGame(friend: FriendSliceState): boolean {
  return inFriendRoom(friend) && friend.viewing === "friend";
}
