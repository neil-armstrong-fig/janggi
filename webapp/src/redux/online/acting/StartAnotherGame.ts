import type {AppThunk} from "@src/redux/AppThunk";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {restarted} from "@src/redux/game/GameSlice";
import {withAFriend} from "@src/redux/online/selecting/WithAFriend";

/**
 * What "new game" means at the end of one. Against anybody else, a fresh deal. After a game with a friend there is no new game to
 * deal — the room is the friend's — so it is leaving it, which puts the player's own game back.
 */
export function startAnotherGame(): AppThunk {
  return (dispatch, getState) => {
    if (withAFriend(getState().friend)) {
      dispatch(leaveFriendRoom());
      return;
    }

    dispatch(restarted());
  };
}
