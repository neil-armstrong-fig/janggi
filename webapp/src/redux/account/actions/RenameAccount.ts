import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {DISPLAY_NAME_MAX_LENGTH} from "@janggi/shared/janggi/account/DisplayNameLimits";
import type {AppThunk} from "@src/redux/AppThunk";
import type {RenameResult} from "@src/redux/account/types/RenameResult";
import {callServer} from "@src/redux/account/server/CallServer";
import {displayNameChanged} from "@src/redux/account/AccountSlice";
import {displayNameFrom} from "@src/redux/account/server/DisplayNameFrom";

/**
 * Changes the display name the server holds for the player, and then the one shown.
 *
 * Checked here first, with the same rule the server applies, so a name that cannot be one is refused without a call
 * and with the reason. What is shown is what the server answered rather than what was typed, so the two cannot
 * differ. A server that could not be reached leaves the name as it was and says so: unlike syncing, which is quietly
 * retried, this is something the player asked for and is waiting to hear about.
 */
export function renameAccount(typed: string): AppThunk<Promise<RenameResult>> {
  return async dispatch => {
    const name = cleanedDisplayName(typed);
    if (name === undefined) {
      return {
        accepted: false,
        message: `A name is 1 to ${DISPLAY_NAME_MAX_LENGTH} characters, with no line breaks.`,
      };
    }

    const response = await callServer("/api/me", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({displayName: name}),
    }).catch(() => undefined);

    if (response?.status === 400) return {accepted: false, message: "That name is not allowed."};
    if (!response?.ok) return {accepted: false, message: "Could not change your name just now. Try again later."};

    const shown = displayNameFrom(await response.json().catch(() => undefined)) ?? name;
    dispatch(displayNameChanged(shown));

    return {accepted: true, message: "Name changed."};
  };
}
