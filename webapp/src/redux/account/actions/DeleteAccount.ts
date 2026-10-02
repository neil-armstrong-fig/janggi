import type {AppThunk} from "@src/redux/AppThunk";
import {callServer} from "@src/redux/account/server/CallServer";
import {signedOut} from "@src/redux/account/AccountSlice";

/**
 * Deletes everything the server holds for the player, and signs out; the device keeps what it has.
 *
 * Only a deletion the server confirmed signs out: one that could not be reached leaves the player signed in, with
 * the button still there, rather than telling them their data is gone when it is not.
 */
export function deleteAccount(): AppThunk<Promise<void>> {
  return async dispatch => {
    const response = await callServer("/api/account", {method: "DELETE"}).catch(() => undefined);

    if (response?.ok) dispatch(signedOut());
  };
}
