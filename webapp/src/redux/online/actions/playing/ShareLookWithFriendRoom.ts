import type {AppThunk} from "@src/redux/AppThunk";
import type {Look} from "@janggi/shared/janggi/online/messages/Look";
import {friendRoom} from "@src/redux/online/FriendRoom";

/** The player changed their board or pieces: the room is told, and passes it to the friend, whose screen follows. */
export function shareLookWithFriendRoom(look: Look): AppThunk {
  return () => friendRoom.wear(look);
}
