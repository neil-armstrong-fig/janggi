import type {AppThunk} from "@src/redux/AppThunk";
import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import {enterFriendRoom} from "@src/redux/online/actions/entering/EnterFriendRoom";
import {friendJoinRefused} from "@src/redux/online/FriendSlice";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

/**
 * Sits down at the room a code is for. What was typed is read as a friend would read it out — any case, with a space or a
 * hyphen — and what is not a code is turned away without a word to the server.
 */
export function joinFriendRoom(typed: string, introduction: Introduction): AppThunk {
  return dispatch => {
    const code = parseFriendCode(typed);

    if (code === undefined) {
      dispatch(friendJoinRefused());
    } else {
      dispatch(enterFriendRoom({code, introduction, returning: false}));
    }
  };
}
