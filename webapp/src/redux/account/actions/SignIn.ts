import type {AppThunk} from "@src/redux/AppThunk";
import {serverUrl} from "@src/redux/account/server/ServerUrl";
import {signInStarted} from "@src/redux/account/AccountSlice";

/**
 * Sends the player to sign in with Google, and asks to be brought back to this page, as it is addressed — the query too, which is what keeps `?account` on the page they return to. What is kept first is that
 * they went, so the page they come back to knows to ask the server who they are.
 *
 * Everything after the redirect — Google's consent, the server exchanging the code, the session cookie — happens
 * on the API's side and is not the app's to see.
 */
export function signIn(): AppThunk {
  return dispatch => {
    dispatch(signInStarted());

    const {origin, pathname, search} = globalThis.location;
    const back = encodeURIComponent(`${origin}${pathname}${search}`);
    globalThis.location.assign(serverUrl(`/api/auth/google?return=${back}`));
  };
}
