import type {AppThunk} from "@src/redux/AppThunk";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {friendRoom} from "@src/redux/online/FriendRoom";
import {friendSetupChosen} from "@src/redux/online/FriendSlice";

/** The arrangement for this player's army, sent to the room, which holds it from the friend until both have chosen. */
export function chooseFriendSetup(setup: SetupName): AppThunk {
  return dispatch => {
    dispatch(friendSetupChosen(setup));
    friendRoom.send({kind: "choose-setup", setup});
  };
}
