import type {AppThunk} from "@src/redux/AppThunk";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import {friendRoom} from "@src/redux/online/FriendRoom";

/**
 * Something this player does in the game: a move, a rest, a call, an offer, an answer or a resignation. It is **only sent**.
 * Nothing changes on this player's board until the room says it happened — which it says to both of them, this one included —
 * so what is on screen is always what the room has judged, and the sound and the motion are the game's own.
 */
export function actInFriendRoom(action: RoomAction): AppThunk {
  return () => friendRoom.send({kind: "act", action});
}
