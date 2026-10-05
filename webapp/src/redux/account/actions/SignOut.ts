import type {AppThunk} from "@src/redux/AppThunk";
import {callServer} from "@src/redux/account/server/CallServer";
import {signedOut} from "@src/redux/account/AccountSlice";
import {turnOffTurnNotifications} from "@src/redux/notifications/TurnOffTurnNotifications";

/**
 * Stops this device being told of the player's turns while the session that may ask is still good, ends the session on the
 * server where it can be reached, and signs out here whether or not it could.
 */
export function signOut(): AppThunk<Promise<void>> {
  return async dispatch => {
    await turnOffTurnNotifications();
    await callServer("/api/auth/logout", {method: "POST"}).catch(() => undefined);
    dispatch(signedOut());
  };
}
