import type {AppThunk} from "@src/redux/AppThunk";
import {enterFriendRoom} from "@src/redux/slices/online/actions/entering/EnterFriendRoom";
import {tutorialLeft} from "@src/redux/slices/tutorial/actions/TutorialLeft";

/**
 * Puts the player's own game and clock back on the board, then goes into the friend room held back while the tutorial
 * had it, if one was. Nothing, where the tutorial is not up.
 */
export function leaveTheTutorial(): AppThunk {
  return (dispatch, getState) => {
    const {parked, heldVisit} = getState().tutorial;
    if (parked === undefined) return;

    dispatch(tutorialLeft(parked));
    if (heldVisit !== undefined) dispatch(enterFriendRoom(heldVisit));
  };
}
