import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";

/** Whether there is a game with a friend, whichever game is on the board: from the moment the room has dealt it to the moment the player leaves. */
export function inFriendRoom(friend: FriendSliceState): boolean {
  return friend.state === "playing" || friend.state === "opponent-left" || friend.state === "over";
}
