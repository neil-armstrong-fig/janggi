import type {AppThunk} from "@src/redux/AppThunk";
import {friendLeft} from "@src/redux/online/FriendSlice";
import {friendRoom} from "@src/redux/online/FriendRoom";
import {localGameRestored} from "@src/redux/online/actions/LocalGameRestored";

/**
 * Lets go of the room, and puts back the game the player had before it. A room left open is still the host's until it
 * expires, and the code gets them back into it (`createFriendRoom`).
 */
export function leaveFriendRoom(): AppThunk {
  return (dispatch, getState) => {
    friendRoom.close();

    const {parkedGame, viewing} = getState().friend;
    // Their own game is on the board already where they were looking at it, and it is the friend game that waits.
    if (parkedGame !== undefined && viewing === "friend") dispatch(localGameRestored(parkedGame));

    dispatch(friendLeft());
  };
}
