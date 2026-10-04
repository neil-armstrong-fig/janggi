import type {AppThunk} from "@src/redux/AppThunk";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {sheetOpened, signInPrompted} from "@src/redux/settings/SettingsSlice";
import {toastShown} from "@src/redux/toast/ToastSlice";
import {switchGame} from "@src/redux/online/actions/SwitchGame";

/**
 * What a tap on Local or Online does. Local is always the game on the device. Online is the game with a friend where
 * there is one; where there is not, it leads to what is missing — the sign-in, for someone signed out, or the sheet
 * that makes or takes a code, for someone signed in.
 */
export function chooseGame(shown: GameShown): AppThunk {
  return (dispatch, getState) => {
    const {friend, account} = getState();

    if (shown === "local" || inFriendRoom(friend)) {
      dispatch(switchGame(shown));

      return;
    }

    if (account.status === "signed-in") {
      dispatch(sheetOpened("friend"));

      return;
    }

    dispatch(signInPrompted());
    dispatch(toastShown("Sign in to play a friend online."));
  };
}
