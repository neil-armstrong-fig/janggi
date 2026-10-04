import type {AppThunk} from "@src/redux/AppThunk";
import type {UnknownAction} from "@reduxjs/toolkit";
import {parkedGameAnswered} from "@src/redux/online/FriendSlice";

/**
 * Does something to the game with the friend, wherever it is: on the board, or waiting while the player's own is. It is the
 * game slice's own action either way, so the rules and the game's behaviour are in one place.
 */
export function intoTheFriendGame(action: UnknownAction): AppThunk {
  return (dispatch, getState) => {
    const {viewing, parkedGame} = getState().friend;

    if (viewing === "local" && parkedGame !== undefined) {
      dispatch(parkedGameAnswered(action));
    } else {
      dispatch(action);
    }
  };
}
