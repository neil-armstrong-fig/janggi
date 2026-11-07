import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {DISPLAY_NAME_MAX_LENGTH} from "@janggi/shared/janggi/account/DisplayNameLimits";
import type {AppThunk} from "@src/redux/AppThunk";
import type {RenameResult} from "@src/redux/slices/account/types/RenameResult";
import {callServer} from "@src/redux/slices/account/server/CallServer";
import {displayNameChanged} from "@src/redux/slices/account/AccountSlice";
import {displayNameFrom} from "@src/redux/slices/account/server/DisplayNameFrom";
import {messagesOf} from "@src/language/MessagesOf";

/**
 * Changes the display name the server holds for the player, and then the one shown.
 *
 * Checked here first, with the same rule the server applies, so a name that cannot be one is refused without a call
 * and with the reason. What is shown is what the server answered rather than what was typed, so the two cannot
 * differ. A server that could not be reached leaves the name as it was and says so: unlike syncing, which is quietly
 * retried, this is something the player asked for and is waiting to hear about.
 */
export function renameAccount(typed: string): AppThunk<Promise<RenameResult>> {
  return async (dispatch, getState) => {
    const words = messagesOf(getState().preferences.language).you.account.name;
    const name = cleanedDisplayName(typed);
    if (name === undefined) {
      return {accepted: false, message: words.badLength(DISPLAY_NAME_MAX_LENGTH)};
    }

    const response = await callServer("/api/me", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({displayName: name}),
    }).catch(() => undefined);

    if (response?.status === 400) return {accepted: false, message: words.notAllowed};
    if (!response?.ok) return {accepted: false, message: words.couldNotChange};

    const shown = displayNameFrom(await response.json().catch(() => undefined)) ?? name;
    dispatch(displayNameChanged(shown));

    return {accepted: true, message: words.changed};
  };
}
