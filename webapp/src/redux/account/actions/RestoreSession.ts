import type {AppThunk} from "@src/redux/AppThunk";
import {callServer} from "@src/redux/account/server/CallServer";
import {displayNameFrom} from "@src/redux/account/server/DisplayNameFrom";
import {signedIn, signedOut, syncFailed} from "@src/redux/account/AccountSlice";
import {syncNow} from "@src/redux/account/actions/SyncNow";

/**
 * Asks the server who the player is, for a page that opens on a device that was signed in — or was sent off to
 * sign in and has come back.
 *
 * Called only where the device says one of those. A signed-out device never gets here, which is what keeps a
 * player who never signs in from making a single call.
 *
 * A server that says nobody is signed in means the session ended or the sign-in was abandoned: signed out. A
 * server that cannot be reached says nothing about that, so a player who was signed in stays so with syncing
 * paused, and one still mid-sign-in is returned to signed out to try again.
 */
export function restoreSession(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const wasSignedIn = getState().account.status === "signed-in";

    try {
      const response = await callServer("/api/me");

      if (response.ok) {
        dispatch(signedIn(displayNameFrom(await response.json().catch(() => undefined))));
        await dispatch(syncNow());
      } else if (response.status === 401) {
        dispatch(signedOut());
      } else {
        throw new Error(`The server could not say who the player is: ${response.status}`);
      }
    } catch {
      dispatch(wasSignedIn ? syncFailed() : signedOut());
    }
  };
}
