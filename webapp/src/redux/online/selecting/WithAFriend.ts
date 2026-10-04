import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";

/**
 * Whether the game on the board is one with a friend: from the moment a friend is seated to the moment the player leaves,
 * which outlasts the room itself — a game over stays on screen, locked, after the room is let go. Not while the room is being
 * reached or waiting for a friend: there is no game with a friend yet, so the board is the player's own, to set up and play as
 * they like. Not while the player's own game is on the board beside one that is dealt, either, for the same reason.
 */
export function withAFriend(friend: FriendSliceState): boolean {
  return seated(friend) && friend.viewing === "friend";
}

function seated(friend: FriendSliceState): boolean {
  if (friend.state === "idle" || friend.state === "waiting-for-a-friend") return false;

  return true;
}
