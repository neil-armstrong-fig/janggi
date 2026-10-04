import type {AppThunk} from "@src/redux/AppThunk";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {UnknownAction} from "@reduxjs/toolkit";
import {actInFriendRoom} from "@src/redux/online/actions/playing/ActInFriendRoom";
import {withAFriend} from "@src/redux/online/selecting/WithAFriend";

/**
 * Does something in the game the way this game does it: in a game with a friend it is **only sent** to the room (`actInFriendRoom`),
 * which says it happened to both players, and nothing changes here until it does; in any other game it is the game's own action,
 * done at once. So a control or a tap on the board names both and does not ask which kind of game it is in.
 */
export function actInGame(forTheRoom: RoomAction, forThisDevice: UnknownAction): AppThunk {
  return (dispatch, getState) => {
    if (withAFriend(getState().friend)) {
      dispatch(actInFriendRoom(forTheRoom));
      return;
    }

    dispatch(forThisDevice);
  };
}
