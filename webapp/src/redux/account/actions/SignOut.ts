import type {AppThunk} from "@src/redux/AppThunk";
import {callServer} from "@src/redux/account/server/CallServer";
import {signedOut} from "@src/redux/account/AccountSlice";

/** Ends the session on the server where it can be reached, and signs out here whether or not it could. */
export function signOut(): AppThunk<Promise<void>> {
  return async dispatch => {
    await callServer("/api/auth/logout", {method: "POST"}).catch(() => undefined);
    dispatch(signedOut());
  };
}
