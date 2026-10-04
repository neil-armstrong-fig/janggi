import type {AppThunk} from "@src/redux/AppThunk";
import type {FriendRoomVisit} from "@src/redux/online/connection/types/FriendRoomVisit";
import {
  friendConnected,
  friendConnecting,
  friendReconnecting,
  friendJoinRefused,
  friendRoomGone,
} from "@src/redux/online/FriendSlice";
import {friendGameOf} from "@src/redux/online/selecting/FriendGameOf";
import {friendStateOf} from "@src/redux/online/selecting/FriendStateOf";
import {friendRoom} from "@src/redux/online/FriendRoom";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {receiveFromFriendRoom} from "@src/redux/online/actions/playing/ReceiveFromFriendRoom";

/**
 * Opens the connection to a room and has what the room says dispatched. The only path into one: making a code, typing
 * one, opening a link and coming back after a reload all end here.
 */
export function enterFriendRoom(visit: FriendRoomVisit): AppThunk {
  return (dispatch, getState) => {
    dispatch(friendConnecting(visit.code));

    friendRoom.open(visit, {
      onMessage: message => dispatch(receiveFromFriendRoom(message)),
      onConnected: () => dispatch(friendConnected()),
      onReconnecting: () => dispatch(friendReconnecting()),
      onRefused: () => dispatch(friendJoinRefused()),
      onGaveUp: () => dispatch(roomGone()),
    });

    // The room is gone: a game that was over stays on screen to be read, until the player leaves it; any other is left now.
    function roomGone(): AppThunk {
      return () => {
        const {friend, game} = getState();
        const over = friendStateOf(friend, friendGameOf(friend, game).played.present) === "over";

        if (over) {
          dispatch(friendRoomGone());
        } else {
          dispatch(leaveFriendRoom());
        }
      };
    }
  };
}
