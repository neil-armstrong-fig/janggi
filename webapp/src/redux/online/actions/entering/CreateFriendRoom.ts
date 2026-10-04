import type {AppThunk} from "@src/redux/AppThunk";
import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {NewFriendRoom} from "@src/redux/online/types/NewFriendRoom";
import {callServer} from "@src/redux/account/server/CallServer";
import {enterFriendRoom} from "@src/redux/online/actions/entering/EnterFriendRoom";
import {friendCreateFailed} from "@src/redux/online/FriendSlice";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

const CODE_ALREADY_OPEN = 409;

/**
 * Asks the server for a room on the side the player chose, kept for the number of days both may be away they chose, and sits down in it. A player has one room open at a time, and
 * where they already have one the server answers with its code (409): that is the room they come back to, which is how a
 * host who lost their code, or is on another device, gets back in.
 *
 * A failure of any kind — offline, over the day's limit — is said in the sheet and nowhere else.
 */
export function createFriendRoom(room: NewFriendRoom, introduction: Introduction): AppThunk<Promise<void>> {
  return async dispatch => {
    try {
      const response = await callServer("/api/rooms", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(room),
      });
      const body: unknown = response.ok || response.status === CODE_ALREADY_OPEN ? await response.json() : undefined;
      const code = parseFriendCode(codeIn(body) ?? "");

      if (code === undefined) {
        dispatch(friendCreateFailed());
        return;
      }

      dispatch(enterFriendRoom({code, introduction, returning: response.status === CODE_ALREADY_OPEN}));
    } catch {
      dispatch(friendCreateFailed());
    }
  };
}

function codeIn(body: unknown): string | undefined {
  const code = typeof body === "object" && body !== null ? (body as Record<string, unknown>)["code"] : undefined;
  if (typeof code === "string") {
    return code;
  }

  return undefined;
}
